const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    name: {type: String, required: true},
    coinId: {type: String, required: true},
    image: {type: String, required: true},
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

coinSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Coin', coinSchema);