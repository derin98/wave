const UserPasswordHistoryOperations = require('../../../../dbOperations/mongoDB/userManagement/userPasswordHistory/userPasswordHistory.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const userPasswordHistoryResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/userManagement/userPasswordHistory/userPasswordHistory.resObjConverter');


async function createUserPasswordHistory(userPasswordHistoryObject) {
    const userPasswordHistory = await UserPasswordHistoryOperations.createUserPasswordHistory(userPasswordHistoryObject);
    return userPasswordHistoryResObjConverter.userPasswordHistoryCreateResponse(userPasswordHistory);
}

async function getAllUserPasswordHistoryPasswords(req) {
    let query = {
        isEnabled: true,
        isDeleted: false,
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    console.log("query", query)
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countUserPasswordHistoryPasswords = await UserPasswordHistoryOperations.countUserPasswordHistoryPasswords(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUserPasswordHistoryPasswords, []);
    }
    const userPasswordHistoryPasswords = await UserPasswordHistoryOperations.getAllUserPasswordHistoryPasswords(query, sort, order, page, limit, skip);
    const totalPages = countUserPasswordHistoryPasswords === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUserPasswordHistoryPasswords / limit));

    return paginationHandler.paginationResObj(page, totalPages, countUserPasswordHistoryPasswords, userPasswordHistoryPasswords);
}

async function getUserPasswordHistory(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.getUserPasswordHistory(query);
}

async function enableUserPasswordHistory(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.enableUserPasswordHistory(query);
}

async function enableUserPasswordHistoryPasswords(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.enableUserPasswordHistoryPasswords(query);
}

async function disableUserPasswordHistory(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.disableUserPasswordHistory(query);
}


async function disableUserPasswordHistoryPasswords(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.disableUserPasswordHistoryPasswords(query);
}

async function deleteUserPasswordHistory(id, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.deleteUserPasswordHistory(query);
}

async function deleteUserPasswordHistoryPasswords(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.deleteUserPasswordHistoryPasswords(query);
}

async function updateUserPasswordHistory(id, updateObject, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPasswordHistoryOperations.updateUserPasswordHistory(query, updateObject);
}

module.exports = {
    createUserPasswordHistory,
    getAllUserPasswordHistoryPasswords,
    getUserPasswordHistory,
    enableUserPasswordHistory,
    enableUserPasswordHistoryPasswords,
    disableUserPasswordHistory,
    disableUserPasswordHistoryPasswords,
    deleteUserPasswordHistory,
    deleteUserPasswordHistoryPasswords,
    updateUserPasswordHistory
};