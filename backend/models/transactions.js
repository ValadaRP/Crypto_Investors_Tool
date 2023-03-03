const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Double = require('@mongoosejs/double');

const transactionSchema = new Schema({
    coinId: {type: String, required: true},
    name: {type: String, required: true},
    image: {type: String, required: true},
    quantity: {type: Double, required: true},
    price: {type: Double, required: true},
    value: {type: Double, required: true},
    date: {type: String, required: true},
    creator: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
});

transactionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Transaction', transactionSchema);