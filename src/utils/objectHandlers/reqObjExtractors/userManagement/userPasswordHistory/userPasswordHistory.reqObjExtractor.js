// Description: Extracts the request object for user related operations.
const mongoose = require("mongoose");
exports.createUserPasswordHistoryObject = (userPassword, password) => {
    return {
        userPassword: userPassword,
        password: password
    };
}

exports.updateUserPasswordHistoryObject = (userPassword, password) => {
    return {
        userPassword: userPassword,
        password: password
    }

}
