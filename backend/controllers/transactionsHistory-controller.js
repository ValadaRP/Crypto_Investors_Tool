const httpError = require('../models/http-error');
const User = require('../models/user');
const Transaction = require('../models/transactions');
const TransactionsHistory = require('../models/transactionsHistory');
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const axios = require("axios");

const getTransactions = async (req, res, next) => {

    let user; //Finding loged in user
    try {
        user = await User.findById(req.userData.userId);
    }catch (err) {
        const error = new httpError('Cannot find user', 500);
        return next(error);
    }

    const transactionsHistory = await TransactionsHistory.find().where('creator').equals(req.userData.userId);
    console.log(transactionsHistory);

    res.json({ transactionsHistory: transactionsHistory.map(transaction => transaction.toObject({ getters: true })), spending: user.spending, earnings: user.earnings });
}


exports.getTransactions = getTransactions;

