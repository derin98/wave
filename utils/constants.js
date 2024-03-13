if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    userTypes: {
        customer: 'CUSTOMER',
        engineer: 'ENGINEER',
        admin: 'ADMIN'
    },
    userStatus: {
        pending: 'PENDING',
        approved: 'APPROVED',
        rejected: 'REJECTED'
    },
    appConstant:{
        appName: process.env.APP_NAME || '',
        appVersion: process.env.APP_VERSION || '',
        appDescription: process.env.APP_DESCRIPTION || '',
    }
}