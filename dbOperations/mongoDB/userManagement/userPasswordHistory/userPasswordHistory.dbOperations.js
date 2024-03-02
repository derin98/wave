const UserPasswordHistory = require('../../../../models/mongoDB/userManagement/userPasswordHistory/userPasswordHistory.model');
const mongoose = require('mongoose');

async function createUserPasswordHistory(userPasswordHistoryObject) {
    return UserPasswordHistory.create(userPasswordHistoryObject);
}

async function getAllUserPasswordHistoryHistories(query, sort, order, page, limit, skip, populateFields) {
    if (limit > 0) {
        return UserPasswordHistory.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return UserPasswordHistory.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countUserPasswordHistoryHistories(query) {
    return UserPasswordHistory.countDocuments(query);
}

async function getUserPasswordHistory(query) {
    const result = await UserPasswordHistory.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enableUserPasswordHistory(query) {
    return UserPasswordHistory.updateOne(query, {$set: {isEnabled: true}});
}

async function enableUserPasswordHistoryHistories(query) {
    return UserPasswordHistory.updateMany(query, {$set: {isEnabled: true}});
}

async function disableUserPasswordHistory(query) {
    return UserPasswordHistory.updateOne(query, {$set: {isEnabled: false}});
}

async function disableUserPasswordHistoryHistories(query) {
    return UserPasswordHistory.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteUserPasswordHistory(query) {
    return UserPasswordHistory.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteUserPasswordHistoryHistories(query) {
    return UserPasswordHistory.updateMany(query, {$set: {isDeleted: true}});
}

async function updateUserPasswordHistory(query, updateObject) {
    return UserPasswordHistory.updateOne(query, {$set: updateObject});
}

async function checkExistingUserPasswordHistoryId(id, businessUnit) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserPasswordHistory = await UserPasswordHistory.findOne(query);
    return existingUserPasswordHistory !== null;
}

async function checkExistingEmployeeIdForBusinessUnit(employeeId, businessUnit) {
    const query = {
        employeeId: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameUserPasswordHistory = await UserPasswordHistory.findOne(query);
    return existingNameUserPasswordHistory !== null;
}

async function checkExistingEmailForBusinessUnit(email, businessUnit) {
    const query = {
        email: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameUserPasswordHistory = await UserPasswordHistory.findOne(query);
    return existingNameUserPasswordHistory !== null;
}

const returnInvalidUserPasswordHistoryIds = async (ids, businessUnit) => {

    let invalidUserPasswordHistoryIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserPasswordHistoryIds.length > 0) {
        return invalidUserPasswordHistoryIds;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserPasswordHistoryHistories = await UserPasswordHistory.find(query).select('_id');

    const existingUserPasswordHistoryIds = existingUserPasswordHistoryHistories.map(userPasswordHistory => userPasswordHistory._id.toString());

    invalidUserPasswordHistoryIds.push(...ids.filter(id => !existingUserPasswordHistoryIds.includes(id)));

    return Array.from(new Set(invalidUserPasswordHistoryIds));
}

module.exports = {
    createUserPasswordHistory,
    getAllUserPasswordHistoryHistories,
    countUserPasswordHistoryHistories,
    getUserPasswordHistory,
    enableUserPasswordHistory,
    enableUserPasswordHistoryHistories,
    disableUserPasswordHistory,
    disableUserPasswordHistoryHistories,
    deleteUserPasswordHistory,
    deleteUserPasswordHistoryHistories,
    updateUserPasswordHistory,
    checkExistingUserPasswordHistoryId,
    checkExistingEmailForBusinessUnit,
    checkExistingEmployeeIdForBusinessUnit,
    returnInvalidUserPasswordHistoryIds
};