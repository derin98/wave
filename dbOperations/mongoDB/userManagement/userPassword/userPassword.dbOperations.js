const UserPassword = require('../../../../models/mongoDB/userManagement/userPassword/userPassword.model');
const mongoose = require('mongoose');

async function createUserPassword(userPasswordObject) {
    return UserPassword.create(userPasswordObject);
}

async function getAllUserPasswords(query, sort, order, page, limit, skip, populateFields) {
    if (limit > 0) {
        return UserPassword.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return UserPassword.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countUserPasswords(query) {
    return UserPassword.countDocuments(query);
}

async function getUserPassword(query) {
    const result = await UserPassword.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enableUserPassword(query) {
    return UserPassword.updateOne(query, {$set: {isEnabled: true}});
}

async function enableUserPasswords(query) {
    return UserPassword.updateMany(query, {$set: {isEnabled: true}});
}

async function disableUserPassword(query) {
    return UserPassword.updateOne(query, {$set: {isEnabled: false}});
}

async function disableUserPasswords(query) {
    return UserPassword.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteUserPassword(query) {
    return UserPassword.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteUserPasswords(query) {
    return UserPassword.updateMany(query, {$set: {isDeleted: true}});
}

async function updateUserPassword(query, updateObject) {
    return UserPassword.updateOne(query, {$set: updateObject});
}

async function checkExistingUserPasswordId(id, businessUnit) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserPassword = await UserPassword.findOne(query);
    return existingUserPassword !== null;
}

async function checkExistingEmployeeIdForBusinessUnit(employeeId, businessUnit) {
    const query = {
        employeeId: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameUserPassword = await UserPassword.findOne(query);
    return existingNameUserPassword !== null;
}

async function checkExistingEmailForBusinessUnit(email, businessUnit) {
    const query = {
        email: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameUserPassword = await UserPassword.findOne(query);
    return existingNameUserPassword !== null;
}

const returnInvalidUserPasswordIds = async (ids, businessUnit) => {

    let invalidUserPasswordIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserPasswordIds.length > 0) {
        return invalidUserPasswordIds;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserPasswords = await UserPassword.find(query).select('_id');

    const existingUserPasswordIds = existingUserPasswords.map(userPassword => userPassword._id.toString());

    invalidUserPasswordIds.push(...ids.filter(id => !existingUserPasswordIds.includes(id)));

    return Array.from(new Set(invalidUserPasswordIds));
}

module.exports = {
    createUserPassword,
    getAllUserPasswords,
    countUserPasswords,
    getUserPassword,
    enableUserPassword,
    enableUserPasswords,
    disableUserPassword,
    disableUserPasswords,
    deleteUserPassword,
    deleteUserPasswords,
    updateUserPassword,
    checkExistingUserPasswordId,
    checkExistingEmailForBusinessUnit,
    checkExistingEmployeeIdForBusinessUnit,
    returnInvalidUserPasswordIds
};