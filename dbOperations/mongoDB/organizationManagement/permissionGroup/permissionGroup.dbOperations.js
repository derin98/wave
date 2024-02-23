const PermissionGroup = require('../../../../models/mongoDB/organizationManagement/permissionGroup/permissionGroup.model');
const mongoose = require('mongoose');

async function createPermissionGroup(permissionGroupObject) {
    return PermissionGroup.create(permissionGroupObject);
}

async function getAllPermissionGroups(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return PermissionGroup.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return PermissionGroup.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countPermissionGroups(query) {
    return PermissionGroup.countDocuments(query);
}

async function getPermissionGroup(query) {
    const result = await PermissionGroup.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enablePermissionGroup(query) {
    return PermissionGroup.updateOne(query, {$set: {isEnabled: true}});
}

async function enablePermissionGroups(query) {
    return PermissionGroup.updateMany(query, {$set: {isEnabled: true}});
}

async function disablePermissionGroup(query) {
    return PermissionGroup.updateOne(query, {$set: {isEnabled: false}});
}

async function disablePermissionGroups(query) {
    return PermissionGroup.updateMany(query, {$set: {isEnabled: false}});
}

async function deletePermissionGroup(query) {
    return PermissionGroup.updateOne(query, {$set: {isDeleted: true}});
}

async function deletePermissionGroups(query) {
    return PermissionGroup.updateMany(query, {$set: {isDeleted: true}});
}

async function updatePermissionGroup(query, updateObject) {
    return PermissionGroup.updateOne(query, {$set: updateObject});
}

async function checkExistingPermissionGroupId(id, businessUnitId) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingPermissionGroup = await PermissionGroup.findOne(query);
    return existingPermissionGroup !== null;
}

async function checkExistingNameForBusinessUnit(name, businessUnitId) {
    const query = {
        name: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingNamePermissionGroup = await PermissionGroup.findOne(query);
    return existingNamePermissionGroup !== null;
}

const returnInvalidPermissionGroupIds = async (ids, businessUnitId) => {

    let invalidPermissionGroupIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidPermissionGroupIds.length > 0) {
        return invalidPermissionGroupIds;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingPermissionGroups = await PermissionGroup.find(query).select('_id');

    const existingPermissionGroupIds = existingPermissionGroups.map(permissionGroup => permissionGroup._id.toString());

    invalidPermissionGroupIds.push(...ids.filter(id => !existingPermissionGroupIds.includes(id)));

    return Array.from(new Set(invalidPermissionGroupIds));
}

module.exports = {
    createPermissionGroup,
    getAllPermissionGroups,
    countPermissionGroups,
    getPermissionGroup,
    enablePermissionGroup,
    enablePermissionGroups,
    disablePermissionGroup,
    disablePermissionGroups,
    deletePermissionGroup,
    deletePermissionGroups,
    updatePermissionGroup,
    checkExistingPermissionGroupId,
    checkExistingNameForBusinessUnit,
    returnInvalidPermissionGroupIds
};