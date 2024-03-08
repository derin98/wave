if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    CRYPTO_SRC_0_NAME: process.env.CRYPTO_SRC_0_NAME,
    CRYPTO_SRC_1_NAME: process.env.CRYPTO_SRC_1_NAME,
    CRYPTO_SRC_2_NAME: process.env.CRYPTO_SRC_2_NAME,
    CRYPTO_SRC_3_NAME: process.env.CRYPTO_SRC_3_NAME,
    CRYPTO_SRC_4_NAME: process.env.CRYPTO_SRC_4_NAME,
    CRYPTO_SECRET_KEY_SRC_1: process.env.CRYPTO_SECRET_KEY_SRC_1,
    CRYPTO_SECRET_KEY_SRC_2: process.env.CRYPTO_SECRET_KEY_SRC_2,
    CRYPTO_SECRET_KEY_SRC_3: process.env.CRYPTO_SECRET_KEY_SRC_3,
    CRYPTO_SECRET_KEY_SRC_4: process.env.CRYPTO_SECRET_KEY_SRC_4,
    CRYPTO_ALGORITHM: process.env.CRYPTO_ALGORITHM,
}



