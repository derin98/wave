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
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    if(req.departments) {
        query.department = { $in: req.departments };
    }
    if(req.userTypes) {
        query.userType = { $in: req.userTypes };
    }
    if(req.designations) {
        query.designation = { $in: req.designations };
    }
    if(req.userTypes) {
        query.userType = { $in: req.userTypes };
    }
    if(req.teams) {
        query.team = { $in: req.teams };
    }
    if(req.reportsTos) {
        query.reportsTo = { $in: req.reportsTos };
    }
    if (req.query.createdAt) {
        query.createdAt = req.createdAt;
    }
    if (req.query.updatedAt) {
        query.updatedAt = req.updatedAt;
    }
    console.log("query", query)
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }
    let populateFields = req.query.populateFields;
    let selectFields = req.query.selectFields;

    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countUsers = await UserOperations.countUsers(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUsers, []);
    }
    const users = await UserOperations.getAllUsers(query, sort, order, page, limit, skip, selectFields, populateFields);
    const totalPages = countUsers === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUsers / limit));

    return paginationHandler.paginationResObj(page, totalPages, countUsers, users);
}

async function getUser(_id, selectFields, populateFields, businessUnit) {
    let query = {
        _id: _id,
        // isEnabled: true,
        isDeleted: false
    };
    console.log("query", query, selectFields, populateFields)
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}


async function getUserByEmail(email, selectFields, populateFields, businessUnit) {
    let query = {
        email: email,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function getUserByEmployeeId(employeeId, selectFields, populateFields, businessUnit) {
    let query = {
        employeeId: employeeId,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function getUserByBuUserId(buUserId, selectFields, populateFields, businessUnit) {
    let query = {
        buUserId: buUserId,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];


    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function getUserForSignIn(userDetails, selectFields, populateFields, businessUnit) {
    let query = {
        // isEnabled: true,
        isDeleted: false
    };
    if (userDetails.email) {
        query.email = userDetails.email;
    }
    else if (userDetails.userId) {
        query.userId = userDetails.userId;
    }
    else if (userDetails.employeeId) {
        query.employeeId = userDetails.employeeId;
    }
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].join(' ')
        : "";
    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function enableUser(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.enableUser(query);
}

async function enableUsers(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.enableUsers(query);
}

async function disableUser(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.disableUser(query);
}


async function disableUsers(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.disableUsers(query);
}

async function deleteUser(id, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.deleteUser(query);
}

async function deleteUsers(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.deleteUsers(query);
}

async function updateUser(id, updateObject, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserOperations.updateUser(query, updateObject);
}
async function updateUserPasswordAndPermission(id, userPassword, userPermission) {
    let query = {
        _id: id,
        isDeleted: false
    };
    return await UserOperations.updateUser(query, {userPassword, userPermission});
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUserByEmail,
    getUserByEmployeeId,
    getUserByBuUserId,
    getUserForSignIn,
    enableUser,
    enableUsers,
    disableUser,
    disableUsers,
    deleteUser,
    deleteUsers,
    updateUser,
    updateUserPasswordAndPermission
};