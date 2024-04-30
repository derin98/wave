if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD
    }

