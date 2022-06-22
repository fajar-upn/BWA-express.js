const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

})

/**
 * this code for bcrypt in password field
 */
userSchema.pre('save', async function (next) {

    const user = this //this mean user fill with this field database

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

module.exports = mongoose.model("User", userSchema)