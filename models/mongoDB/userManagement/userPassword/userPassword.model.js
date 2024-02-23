const mongoose = require("mongoose");

const userPasswordSchema = new mongoose.Schema({

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    password: {
        type: String,
        required: true,
    },
    userPasswordHistories:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "UserPasswordHistory",
        required: true
    },
    expiredAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        // I want to default to a new date
        type: Date,
        immutable: true,  // This will ensure the createdAt column is never updated but once in the start
        default: () => {
            return Date.now();
        }
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    },


})


module.exports = mongoose.model("UserPassword", userPasswordSchema, "userPasswords");