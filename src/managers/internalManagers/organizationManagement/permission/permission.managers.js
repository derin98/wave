const PermissionOperations = require('../../../../dbOperations/mongoDB/organizationManagement/permission/permission.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const permissionResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/permission/permission.resObjConverter');
const DepartmentOperations = require("../../../../dbOperations/mongoDB/organizationManagement/department/department.dbOperations");
const UserPermissionOperations = require("../../../../dbOperations/mongoDB/userManagement/userPermission/userPermission.dbOperations");


async function createPermission(permissionObject) {
    const permission = await PermissionOperations.createPermission(permissionObject);
    return permissionResObjConverter.permissionCreateResponse(permission);
}

async function getAllPermissions(req) {
    let query = {
        isEnabled: true,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }

    if(req.query.permissionGroups) {
        query.permissionGroup = { $in: req.query.permissionGroups };
    }

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

    const countPermissions = await PermissionOperations.countPermissions(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countPermissions, []);
    }
    const permissions = await PermissionOperations.getAllPermissions(query, sort, order, page, limit, skip, selectFields, populateFields);
    const totalPages = countPermissions === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countPermissions / limit));

    return paginationHandler.paginationResObj(page, totalPages, countPermissions, permissions);
}

async function getPermission(id, selectFields, populateFields, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
    ? [...new Set(populateFields.split(','))].join(' ')
    : "";

    selectFields = selectFields
    ? [...new Set(selectFields.split(',')), 'name', '_id'].join(' ')
    : ['name', '_id'];

    return await PermissionOperations.getPermission(query, selectFields, populateFields);
}

async function getPermissions(ids, selectFields, populateFields, businessUnit) {
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

    return await PermissionOperations.getPermissions(query, selectFields, populateFields);
}

async function getPermissionByName(name, businessUnit) {

    let query = {
        // isEnabled : true,
        isDeleted : false,
        name : name
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.getPermission(query);
}

async function enablePermission(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.enablePermission(query);
}

async function enablePermissions(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.enablePermissions(query);
}

async function disablePermission(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.disablePermission(query);
}


async function disablePermissions(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.disablePermissions(query);
}

async function deletePermission(id, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.deletePermission(query);
}

async function deletePermissions(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.deletePermissions(query);
}

async function updatePermission(id, updateObject, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await PermissionOperations.updatePermission(query, updateObject);
}

module.exports = {
    createPermission,
    getAllPermissions,
    getPermission,
    getPermissions,
    getPermissionByName,
    enablePermission,
    enablePermissions,
    disablePermission,
    disablePermissions,
    deletePermission,
    deletePermissions,
    updatePermission
};