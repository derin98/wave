const PermissionOperations = require('../../../../dbOperations/mongoDB/organizationManagement/permission/permission.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const permissionResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/permission/permission.resObjConverter');


async function createPermission(permissionObject) {
    const permission = await PermissionOperations.createPermission(permissionObject);
    return permissionResObjConverter.permissionCreateResponse(permission);
}

async function getAllPermissions(req) {
    let query = {
        isEnabled: true,
        isDeleted: false
    };
    if(req.businessUnitId) {
        query.businessUnitId = req.businessUnitId;
    }
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countPermissions = await PermissionOperations.countPermissions(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countPermissions, []);
    }
    const permissions = await PermissionOperations.getAllPermissions(query, sort, order, page, limit, skip);
    const totalPages = countPermissions === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countPermissions / limit));

    return paginationHandler.paginationResObj(page, totalPages, countPermissions, permissions);
}

async function getPermission(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.getPermission(query);
}

async function enablePermission(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.enablePermission(query);
}

async function enablePermissions(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.enablePermissions(query);
}

async function disablePermission(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.disablePermission(query);
}


async function disablePermissions(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.disablePermissions(query);
}

async function deletePermission(id, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.deletePermission(query);
}

async function deletePermissions(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.deletePermissions(query);
}

async function updatePermission(id, updateObject, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionOperations.updatePermission(query, updateObject);
}

module.exports = {
    createPermission,
    getAllPermissions,
    getPermission,
    enablePermission,
    enablePermissions,
    disablePermission,
    disablePermissions,
    deletePermission,
    deletePermissions,
    updatePermission
};