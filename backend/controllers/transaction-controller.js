const httpError = require('../models/http-error');
const User = require('../models/user');
const Transaction = require('../models/transactions');
const TransactionHistory = require('../models/transactionsHistory');
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const {check} = require("express-validator");
const axios = require("axios");


const transactionBuy = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {coinId,name,image,quantity,price} = req.body;
    let user; //Finding loged in user
    try {
        user = await User.findById(req.userData.userId);
    }catch (err) {
        const error = new httpError('Cannot find user', 500);
        return next(error);
    }
    if (!user) {
        const error = new httpError('Could not find user for provided id', 404);
        return next(error);
    }
    const todayDate = new Date();
    const formatedDate = todayDate.toISOString().slice(0,10) + " " + todayDate.toISOString().slice(11,19);
    const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=eur&precision=4`);
    const createdTransaction = new Transaction({
        coinId,
        name,
        image,
        quantity,
        price,
        value: parseFloat(quantity * price),
        date: formatedDate,
        creator: req.userData.userId
    });
    const transactionHistory = new TransactionHistory({
        type: "Buy",
        coinId,
        name,
        image,
        quantity,
        price,
        value: parseFloat(quantity * price),
        date: formatedDate,
        creator: req.userData.userId
    });
    if (parseFloat(user.accountBalance) < createdTransaction.value){
        const error = new httpError(`Not enough money to fulfill transaction! `, 500);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTransaction.save({session: sess});
        await transactionHistory.save({session: sess});
        user.transactions.push(createdTransaction);
        user.transactionHistory.push(transactionHistory);
        user.accountBalance = parseFloat(parseFloat(user.accountBalance - createdTransaction.value).toFixed(4));
        user.spending = parseFloat(parseFloat(user.spending + createdTransaction.value).toFixed(4));
        await user.save({session: sess});
        await sess.commitTransaction();
    }catch (err) {
        const error = new httpError('Creating transaction failed, please try again.', 500);
        return next(error);
    }
    res.json({transaction: createdTransaction});
}

const transactionSell = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {transactionId} = req.body;
    let user; //Finding loged in user
    try {
        user = await User.findById(req.userData.userId);
    }catch (err) {
        const error = new httpError('Cannot find user', 500);
        return next(error);
    }

    let allTransactions;
    try {
        allTransactions = await Transaction.find().where('creator').equals(req.userData.userId);
        // console.log(allTransactions);
    }catch (err) {
        const error = new httpError('Something went wrong could not find the Transactions', 500);
        return next(error);
    }
    const selectedTransaction = allTransactions.find(c => c.id === transactionId);
    const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedTransaction.coinId}&vs_currencies=eur&precision=4`);
    const newValue = parseFloat(parseFloat(selectedTransaction.quantity * data[selectedTransaction.coinId].eur).toFixed(4));
    const newPrice = parseFloat(parseFloat(data[selectedTransaction.coinId].eur).toFixed(4));

    const todayDate = new Date();
    const formatedDate = todayDate.toISOString().slice(0,10) + " " + todayDate.toISOString().slice(11,19);

    const transactionHistory = new TransactionHistory({
        type: "Sell",
        coinId: selectedTransaction.coinId,
        name: selectedTransaction.name,
        image: selectedTransaction.image,
        quantity: selectedTransaction.quantity,
        price: selectedTransaction.price,
        sellPrice: newPrice,
        transactionBalance: parseFloat(selectedTransaction.quantity * newPrice - selectedTransaction.quantity * selectedTransaction.price),
        value: newValue,
        date: formatedDate,
        creator: req.userData.userId
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await selectedTransaction.remove({session: sess});
        await transactionHistory.save({session: sess});
        user.transactionHistory.push(transactionHistory);
        user.transactions.pull(selectedTransaction);
        user.accountBalance = parseFloat(parseFloat(user.accountBalance + newValue).toFixed(4));
        user.earnings = parseFloat(parseFloat(user.earnings + newValue).toFixed(4));
        await user.save({session: sess});
        await sess.commitTransaction();
        console.log("Transaction removed");
    }catch (err) {
        const error = new httpError('Something went wrong, could not sell Coin.', 500);
        return next(error);
    }


    res.json({message: `You sold ${selectedTransaction.name} for ${newValue}€`});
}

const transactionGetAll = async (req, res, next) => {
    const userId = req.params.uid;
    let allTransactions;
    try {
        allTransactions = await Transaction.find().where('creator').equals(userId);
        // console.log(transactionCoin);
    }catch (err) {
        const error = new httpError('Something went wrong could not find the Transactions', 500);
        return next(error);
    }
    res.json({transactions: allTransactions.map(transaction => transaction.toObject({getters: true}))});
}


exports.transactionBuy = transactionBuy;
exports.transactionSell = transactionSell;
exports.transactionGetAll = transactionGetAll;