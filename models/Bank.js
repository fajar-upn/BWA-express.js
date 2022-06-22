const mongoose = require('mongoose')

/**
 * bank schema
 */
const bankSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Bank', bankSchema)