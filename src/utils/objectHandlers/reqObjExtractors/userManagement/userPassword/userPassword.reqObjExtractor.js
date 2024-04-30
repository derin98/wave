// Description: Extracts the request object for user related operations.
const mongoose = require("mongoose");
exports.createUserPasswordObject = (userId, password) => {
    return {
        user: userId,
        password: password,
        expiredAt: Date.now(),
    };
}

exports.updateUserPasswordObject = (userId, password) => {
    return {
        user: userId,
        password: password,
        expiredAt: Date.now(),
    }

}
