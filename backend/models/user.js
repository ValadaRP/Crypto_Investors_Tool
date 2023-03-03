const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Double = require('@mongoosejs/double');

const userSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true, minLength: 6},
    email: {type: String, required: true, unique: true},
    accountBalance: {type: Double, required: true, default: 0},
    earnings: {type: Double, required: true, default: 0},
    spending: {type: Double, required: true, default: 0},
    coins: [{ type: mongoose.Types.ObjectId, ref: 'Coin', required: true }],
    transactions: [{ type: mongoose.Types.ObjectId, ref: 'Transaction', required: true }],
    transactionHistory: [{ type: mongoose.Types.ObjectId, ref: 'TransactionHistory', required: true }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


