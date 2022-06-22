const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

/**
 * category schema
 */
const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    itemId: {
        type: ObjectId,
        ref: "Item"
    }
})

module.exports = mongoose.model('Image', imageSchema)