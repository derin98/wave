const PermissionGroupOperations = require('../../../../dbOperations/mongoDB/organizationManagement/permissionGroup/permissionGroup.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const permissionGroupResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/permissionGroup/permissionGroup.resObjConverter');


async function createPermissionGroup(permissionGroupObject) {
    const permissionGroup = await PermissionGroupOperations.createPermissionGroup(permissionGroupObject);
    return permissionGroupResObjConverter.permissionGroupCreateResponse(permissionGroup);
}

async function getAllPermissionGroups(req) {
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

    const countPermissionGroups = await PermissionGroupOperations.countPermissionGroups(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countPermissionGroups, []);
    }
    const permissionGroups = await PermissionGroupOperations.getAllPermissionGroups(query, sort, order, page, limit, skip);
    const totalPages = countPermissionGroups === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countPermissionGroups / limit));

    return paginationHandler.paginationResObj(page, totalPages, countPermissionGroups, permissionGroups);
}

async function getPermissionGroup(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.getPermissionGroup(query);
}

async function enablePermissionGroup(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.enablePermissionGroup(query);
}

async function enablePermissionGroups(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.enablePermissionGroups(query);
}

async function disablePermissionGroup(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.disablePermissionGroup(query);
}


async function disablePermissionGroups(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.disablePermissionGroups(query);
}

async function deletePermissionGroup(id, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.deletePermissionGroup(query);
}

async function deletePermissionGroups(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.deletePermissionGroups(query);
}

async function updatePermissionGroup(id, updateObject, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await PermissionGroupOperations.updatePermissionGroup(query, updateObject);
}

module.exports = {
    createPermissionGroup,
    getAllPermissionGroups,
    getPermissionGroup,
    enablePermissionGroup,
    enablePermissionGroups,
    disablePermissionGroup,
    disablePermissionGroups,
    deletePermissionGroup,
    deletePermissionGroups,
    updatePermissionGroup
};