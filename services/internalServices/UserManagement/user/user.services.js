const UserOperations = require('../../../../dbOperations/mongoDB/userManagement/user/user.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const userResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/userManagement/user/user.resObjConverter');


async function createUser(userObject) {
    const user = await UserOperations.createUser(userObject);
    return userResObjConverter.userCreateResponse(user);
}

async function getAllUsers(req) {
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

    const countUsers = await UserOperations.countUsers(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUsers, []);
    }
    const users = await UserOperations.getAllUsers(query, sort, order, page, limit, skip);
    const totalPages = countUsers === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUsers / limit));

    return paginationHandler.paginationResObj(page, totalPages, countUsers, users);
}

async function getUser(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.getUser(query);
}

async function enableUser(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.enableUser(query);
}

async function enableUsers(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.enableUsers(query);
}

async function disableUser(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.disableUser(query);
}


async function disableUsers(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.disableUsers(query);
}

async function deleteUser(id, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.deleteUser(query);
}

async function deleteUsers(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.deleteUsers(query);
}

async function updateUser(id, updateObject, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await UserOperations.updateUser(query, updateObject);
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    enableUser,
    enableUsers,
    disableUser,
    disableUsers,
    deleteUser,
    deleteUsers,
    updateUser
};