const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

/**
 * booking schema
 */
const bookingSchema = new mongoose.Schema({
    bookingStartDate: {
        type: Date,
        required: true
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
    invoice: {
        type: String,
        required: true
    },
    /**
     * not use array because we just need one itemId
     * itemId : [{}]
     */
    itemId: {
        _id: {
            type: ObjectId,
            ref: "Object",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true
        }
    },
    total: {
        type: Number,
        required: true
    },
    memberId: {
        type: ObjectId,
        ref: "Member"
    },
    bankId: {
        type: ObjectId,
        ref: "Bank"
    },
    payment: {
        proofPayment: {
            type: String,
            required: true
        },
        bankFrom: {
            type: String,
            required: true
        },
        accountHolder: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'Process'
        }
    },
})

module.exports = mongoose.model('Booking', bookingSchema)