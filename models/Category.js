const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

/**
 * category schema
 */
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    /**
     * relation one to many
     * one category have many items
     * 
     * [{}] is one, this mean 'one' category has 'many' item
     */
    itemId: [{
        type: ObjectId,
        ref: 'Item'
    }]

})

module.exports = mongoose.model('Category', categorySchema)