const bcrypt = require('bcryptjs');
const httpError = require('../models/http-error');
const Coin = require('../models/coin');
const User = require('../models/user');
const mongoose = require('mongoose');
const {validationResult} = require("express-validator");


//Todo: Add errors handling

const coinAddFavorite = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {name,coinId,image} = req.body; // Here should add coinId
    //check if user even exist
    let favoritesCoins;
    try {
        favoritesCoins = await Coin.find().where('creator').equals(req.userData.userId);
    } catch (error) {
        return next(new httpError('Something went wrong could not find the Coins.', 500));
    }
    const selectedCoin = favoritesCoins.find(c => c.name === name);
    if (favoritesCoins.filter(e => e.name === name).length > 0) {
        try {
            const userCoin = await Coin.findById(selectedCoin.id).populate('creator');
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await userCoin.remove({session: sess});
            userCoin.creator.coins.pull(userCoin);
            await userCoin.creator.save({session: sess});
            await sess.commitTransaction();
            console.log("Coin removed");
        } catch (error) {
            console.log(error);
            return next(new httpError('Something went wrong, could not delete coin.', 500));
        }
    } else {
            let user;
            try {
                user = await User.findById(req.userData.userId);
            } catch (err) {
                const error = new httpError('Cannot find user', 500);
                return next(error);
            }
            if (!user) {
                const error = new httpError('Could not find user for provided id', 404);
                return next(error);
            }
            const createdCoin = new Coin({
                name,
                coinId: coinId,
                image: image,
                creator: req.userData.userId
            });
            try {
                const sess = await mongoose.startSession();
                sess.startTransaction();
                await createdCoin.save({session: sess});
                user.coins.push(createdCoin);
                await user.save({session: sess});
                await sess.commitTransaction();
            } catch (err) {
                const error = new httpError(
                    'Adding coin failed while transaction, please try again.',
                    500
                );
                return next(error);
            }
        res.status(201).json({coin: createdCoin});
    }
}


const getCoinsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let coins;

    try {
        coins = await Coin.find().where('creator').equals(userId);
    } catch (error) {
        return next(new httpError('Something went wrong could not find the Coins.', 500));
    }

    // if (!coins || coins.length === 0) {
    //     return next(new httpError('Could not find coins for the provided user id.', 404));
    // }
    res.json({coins: coins.map(coin => coin.toObject({getters: true}))});
}



exports.coinAddFavorite = coinAddFavorite;
exports.getCoinsByUserId = getCoinsByUserId;
