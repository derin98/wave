const generator = require('generate-password');
const generatedPassword = generator.generate({
    length: 10,
    numbers: true
});

exports.generatedPassword = generatedPassword;