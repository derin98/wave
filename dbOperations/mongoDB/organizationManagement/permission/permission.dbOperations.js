const Permission = require('../../../../models/mongoDB/organizationManagement/permission/permission.model');
const mongoose = require('mongoose');
const {query} = require("express");

async function createPermission(permissionObject) {
    return Permission.create(permissionObject);
}

async function getAllPermissions(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return Permission.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return Permission.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countPermissions(query) {
    return Permission.countDocuments(query);
}

async function getPermission(query) {
    const result = await Permission.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enablePermission(query) {
    return Permission.updateOne(query, {$set: {isEnabled: true}});
}

async function enablePermissions(query) {
    return Permission.updateMany(query, {$set: {isEnabled: true}});
}

async function disablePermission(query) {
    return Permission.updateOne(query, {$set: {isEnabled: false}});
}

async function disablePermissions(query) {
    return Permission.updateMany(query, {$set: {isEnabled: false}});
}

async function deletePermission(query) {
    return Permission.updateOne(query, {$set: {isDeleted: true}});
}

async function deletePermissions(query) {
    return Permission.updateMany(query, {$set: {isDeleted: true}});
}

async function updatePermission(query, updateObject) {
    return Permission.updateOne(query, {$set: updateObject});
}

async function checkExistingPermission(id, businessUnit, permissionGroup) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }

    const query = {_id: id, isDeleted: false};

    if (businessUnit) {
        query.businessUnit = businessUnit;
    }

    if (permissionGroup) {
        query.permissionGroup = permissionGroup;
    }

    const existingPermission = await Permission.findOne(query);
    return existingPermission;
}

async function checkExistingNameForPermissionGroup(name, permissionGroup, businessUnit) {
    const query = {name: {$regex: new RegExp(`^${name}$`, 'i')}, isDeleted: false, permissionGroup: permissionGroup }
    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    console.log("query", query)
    const existingNamePermission = await Permission.findOne(query);
    console.log("existingNamePermission", existingNamePermission)
    return existingNamePermission !== null;
}

const returnInvalidPermissions = async (ids, businessUnit) => {

    let invalidPermissions = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidPermissions.length > 0) {
        return invalidPermissions;
    }
    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingPermissions = await Permission.find(query).select('_id');

    const filterIds = existingPermissions.map(permission => permission._id.toString());

    invalidPermissions.push(...ids.filter(id => !filterIds.includes(id)));

    return Array.from(new Set(invalidPermissions));
}

module.exports = {
    createPermission,
    getAllPermissions,
    countPermissions,
    getPermission,
    enablePermission,
    enablePermissions,
    disablePermission,
    disablePermissions,
    deletePermission,
    deletePermissions,
    updatePermission,
    checkExistingPermission,
    checkExistingNameForPermissionGroup,
    returnInvalidPermissions
};