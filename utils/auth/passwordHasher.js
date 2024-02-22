const bcrypt = require("bcrypt");

function passwordHashCompareSync(data, hash) {
    return bcrypt.compareSync(data, hash);
}


function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

module.exports = {
    passwordHashCompareSync,
    hashPassword,
};