const mongoose = require("mongoose");

const userPasswordHistorySchema = new mongoose.Schema({

    userPassword: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserPassword",
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => {
            return Date.now();
        }
    },
})


module.exports = mongoose.model("UserPasswordHistory", userPasswordHistorySchema, "userPasswordHistories");