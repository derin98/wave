const UserPermissionOperations = require('../../../../dbOperations/mongoDB/userManagement/userPermission/userPermission.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const userPermissionResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/userManagement/userPermission/userPermission.resObjConverter');


async function createUserPermission(userPermissionObject) {
    const userPermission = await UserPermissionOperations.createUserPermission(userPermissionObject);
    return userPermissionResObjConverter.userPermissionCreateResponse(userPermission);
}

async function getAllUserPermissions(req) {
    let query = {
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    if(department) {
        query.department = { $in: req.query.departments };
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
        ? [...new Set(selectFields.split(',')), 'name', '_id']
            // .filter(field => field !== 'userPassword')
            .join(' ')
        : ['name', '_id'];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countUsers = await UserPermissionOperations.countUserPermissions(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUsers, []);
    }
    const users = await UserPermissionOperations.getAllUserPermissions(query, sort, order, page, limit, skip, selectFields, populateFields);
    const totalPages = countUsers === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUsers / limit));

    return paginationHandler.paginationResObj(page, totalPages, countUsers, users);
}

async function getUserPermission(_id, selectFields, populateFields, businessUnit) {
    let query = {
        _id: _id,
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id']
            // .filter(field => field !== 'userPassword')
            .join(' ')
        : ['name', '_id'];

    return await UserPermissionOperations.getUserPermission(query, selectFields, populateFields);
}

async function getUserPermissions(ids, selectFields, populateFields, businessUnit) {
    let query = {
        _id: { $in: ids },
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))]
            // .filter(field => field !== 'userPassword')
            .join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserPermissionOperations.getUserPermission(query, selectFields, populateFields);
}

async function updateUserPermission(id, updateObject, businessUnit) {
    let query = {
        _id: id,
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await UserPermissionOperations.updateUserPermission(query, updateObject);
}

async function updateUserPermissions(req) {
    const bulkUpdateOperations = [];
    for (const userPermission of req.body.userPermissions) {
        const userPermissionReqObj = {
            positivePermissions: userPermission.positivePermissions || [],
            negativePermissions: userPermission.negativePermissions || [],
            updatedBy: req.userId
        };
        const query = {
            _id: userPermission.id
        };
        // if(req.businessUnit) {
        //     query.businessUnit = req.businessUnit;
        // }
        bulkUpdateOperations.push({
            updateOne: {
                filter: query,
                update: userPermissionReqObj
            }
        });
    }
    return await UserPermissionOperations.updateUserPermissions(bulkUpdateOperations);

}


module.exports = {
    createUserPermission,
    getAllUserPermissions,
    getUserPermission,
    getUserPermissions,
    updateUserPermission,
    updateUserPermissions
};