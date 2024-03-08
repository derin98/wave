if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    CRYPTO_SECRET_KEY_WEB: process.env.CRYPTO_SECRET_KEY_WEB,
    CRYPTO_SECRET_KEY_DEVICE_SHADOW: process.env.CRYPTO_SECRET_KEY_DEVICE_SHADOW,
    CRYPTO_SECRET_KEY_AR: process.env.CRYPTO_SECRET_KEY_AR,
    CRYPTO_SECRET_KEY_VR: process.env.CRYPTO_SECRET_KEY_VR,
    CRYPTO_ALGORITHM: process.env.CRYPTO_ALGORITHM,
}



