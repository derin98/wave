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

async function checkExistingUserType(id, businessUnit, department) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }

    const query = {_id: id, isDeleted: false};

    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    if (department) {
        query.department = department;
    }

    const existingUserType = await UserType.findOne(query);
    return existingUserType;
}

async function checkExistingNameForDepartment(name, department, businessUnit) {
    const query = {name: {$regex: new RegExp(`^${name}$`, 'i')}, isDeleted: false, department: department }
    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    console.log("query", query)
    const existingNameUserType = await UserType.findOne(query);
    console.log("existingNameUserType", existingNameUserType)
    return existingNameUserType !== null;
}

const returnInvalidUserTypes = async (ids, businessUnit) => {

    let invalidUserTypes = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserTypes.length > 0) {
        return invalidUserTypes;
    }
    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserTypes = await UserType.find(query).select('_id');

    const filterIds = existingUserTypes.map(userType => userType._id.toString());

    invalidUserTypes.push(...ids.filter(id => !filterIds.includes(id)));

    return Array.from(new Set(invalidUserTypes));
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
    checkExistingUserType,
    checkExistingNameForDepartment,
    returnInvalidUserTypes
};