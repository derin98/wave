const UserTypeOperations = require('../../../../dbOperations/mongoDB/organizationManagement/userType/userType.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const userTypeResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/userType/userType.resObjConverter');


async function createUserType(userTypeObject) {
    const userType = await UserTypeOperations.createUserType(userTypeObject);
    return userTypeResObjConverter.userTypeCreateResponse(userType);
}

async function getAllUserTypes(req) {
    let query = {
        isEnabled: true,
        isDeleted: false
    };
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countUserTypes = await UserTypeOperations.countUserTypes(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUserTypes, []);
    }
    const userTypes = await UserTypeOperations.getAllUserTypes(query, sort, order, page, limit, skip);
    const totalPages = countUserTypes === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUserTypes / limit));

    return paginationHandler.paginationResObj(page, totalPages, countUserTypes, userTypes);
}

async function getUserType(id) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    return await UserTypeOperations.getUserType(query);
}

async function enableUserType(id) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    return await UserTypeOperations.enableUserType(query);
}

async function enableUserTypes(ids) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    return await UserTypeOperations.enableUserTypes(query);
}

async function disableUserType(id) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    return await UserTypeOperations.disableUserType(query);
}


async function disableUserTypes(ids) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    return await UserTypeOperations.disableUserTypes(query);
}

async function deleteUserType(id) {
    let query = {
        _id: id,
        isDeleted: false
    };
    return await UserTypeOperations.deleteUserType(query);
}

async function deleteUserTypes(ids) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    return await UserTypeOperations.deleteUserTypes(query);
}

async function updateUserType(id, updateObject) {
    let query = {
        _id: id,
        isDeleted: false
    };
    return await UserTypeOperations.updateUserType(query, updateObject);
}

module.exports = {
    createUserType,
    getAllUserTypes,
    getUserType,
    enableUserType,
    enableUserTypes,
    disableUserType,
    disableUserTypes,
    deleteUserType,
    deleteUserTypes,
    updateUserType
};