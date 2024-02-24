const UserPasswordOperations = require('../../../../dbOperations/mongoDB/userManagement/userPassword/userPassword.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const userPasswordResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/userManagement/userPassword/userPassword.resObjConverter');


async function createUserPassword(userPasswordObject) {
    const userPassword = await UserPasswordOperations.createUserPassword(userPasswordObject);
    return userPasswordResObjConverter.userPasswordCreateResponse(userPassword);
}

async function getAllUserPasswordPasswords(req) {
    let query = {
        isEnabled: true,
        isDeleted: false,
    };
    if(req.businessUnitId) {
        query.businessUnitId = req.businessUnitId;
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

    const countUserPasswordPasswords = await UserPasswordOperations.countUserPasswordPasswords(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUserPasswordPasswords, []);
    }
    const userPasswordPasswords = await UserPasswordOperations.getAllUserPasswordPasswords(query, sort, order, page, limit, skip);
    const totalPages = countUserPasswordPasswords === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUserPasswordPasswords / limit));

    return paginationHandler.paginationResObj(page, totalPages, countUserPasswordPasswords, userPasswordPasswords);
}

async function getUserPassword(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.getUserPassword(query);
}

async function enableUserPassword(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.enableUserPassword(query);
}

async function enableUserPasswordPasswords(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.enableUserPasswordPasswords(query);
}

async function disableUserPassword(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.disableUserPassword(query);
}


async function disableUserPasswordPasswords(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.disableUserPasswordPasswords(query);
}

async function deleteUserPassword(id, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.deleteUserPassword(query);
}

async function deleteUserPasswordPasswords(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.deleteUserPasswordPasswords(query);
}

async function updateUserPassword(id, updateObject, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserPasswordOperations.updateUserPassword(query, updateObject);
}

module.exports = {
    createUserPassword,
    getAllUserPasswordPasswords,
    getUserPassword,
    enableUserPassword,
    enableUserPasswordPasswords,
    disableUserPassword,
    disableUserPasswordPasswords,
    deleteUserPassword,
    deleteUserPasswordPasswords,
    updateUserPassword
};