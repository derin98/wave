const UserType = require('../../../../models/mongoDB/organizationManagement/userType/userType.model');
const mongoose = require('mongoose');
const {query} = require("express");

async function createUserType(userTypeObject) {
    return UserType.create(userTypeObject);
}

async function getAllUserTypes(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return UserType.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return UserType.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countUserTypes(query) {
    return UserType.countDocuments(query);
}

async function getUserType(query) {
    const result = await UserType.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enableUserType(query) {
    return UserType.updateOne(query, {$set: {isEnabled: true}});
}

async function enableUserTypes(query) {
    return UserType.updateMany(query, {$set: {isEnabled: true}});
}

async function disableUserType(query) {
    return UserType.updateOne(query, {$set: {isEnabled: false}});
}

async function disableUserTypes(query) {
    return UserType.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteUserType(query) {
    return UserType.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteUserTypes(query) {
    return UserType.updateMany(query, {$set: {isDeleted: true}});
}

async function updateUserType(query, updateObject) {
    return UserType.updateOne(query, {$set: updateObject});
}

async function checkExistingUserTypeId(id, businessUnitId) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }

    const query = {_id: id, isDeleted: false};

    if (businessUnitId) {
        query.businessUnitId = businessUnitId;
    }

    const existingUserType = await UserType.findOne(query);
    return existingUserType;
}

async function checkExistingNameForDepartment(name, departmentId, businessUnitId) {
    const query = {name: {$regex: new RegExp(`^${name}$`, 'i')}, isDeleted: false, departmentId: departmentId }
    if (businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    console.log("query", query)
    const existingNameUserType = await UserType.findOne(query);
    console.log("existingNameUserType", existingNameUserType)
    return existingNameUserType !== null;
}

const returnInvalidUserTypeIds = async (ids, businessUnitId) => {

    let invalidUserTypeIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserTypeIds.length > 0) {
        return invalidUserTypeIds;
    }
    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if (businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingUserTypes = await UserType.find(query).select('_id');

    const existingUserTypeIds = existingUserTypes.map(userType => userType._id.toString());

    invalidUserTypeIds.push(...ids.filter(id => !existingUserTypeIds.includes(id)));

    return Array.from(new Set(invalidUserTypeIds));
}

module.exports = {
    createUserType,
    getAllUserTypes,
    countUserTypes,
    getUserType,
    enableUserType,
    enableUserTypes,
    disableUserType,
    disableUserTypes,
    deleteUserType,
    deleteUserTypes,
    updateUserType,
    checkExistingUserTypeId,
    checkExistingNameForDepartment,
    returnInvalidUserTypeIds
};