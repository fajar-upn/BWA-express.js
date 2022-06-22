const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * item schema
 * note: becareful with CAPITAL alphabet
 * 'Schema' not 'schema'
 */
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        default: 'Indonesia',
    },
    city: {
        type: String,
        required: true,
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        default: 'night'
    },
    sumBooking: {
        type: Number,
        default: 0
    },
    /**
     * have relation one to many
     * one category have a many items
     * 
     * {} is many, this mean 'many' item has 'one' category
     * 
     * note: please look [{}] and {}
     */
    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }],
    featureId: [{
        type: ObjectId,
        ref: 'Feature'
    }],
    activityId: [{
        type: ObjectId,
        ref: 'Activity'
    }],
})

module.exports = mongoose.model('Item', itemSchema)