const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Double = require('@mongoosejs/double');

const transactionsHistorySchema = new Schema({
    type: {type: String, required: true},
    coinId: {type: String, required: true},
    name: {type: String, required: true},
    image: {type: String, required: true},
    quantity: {type: Double, required: true},
    price: {type: Double, required: true},
    sellPrice: {type: Double, required: false, default: 0},
    transactionBalance: {type: Double, required: false, default: 0},
    value: {type: Double, required: true},
    date: {type: String, required: true},
    creator: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
});

transactionsHistorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('TransactionsHistory', transactionsHistorySchema);