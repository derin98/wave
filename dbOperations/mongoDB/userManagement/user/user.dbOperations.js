const User = require('../../../../models/mongoDB/userManagement/user/user.model');
const mongoose = require('mongoose');
const userReqObjExtractor = require('../../../../utils/objectHandlers/reqObjExtractors/userManagement/user/user.reqObjExtractor');
async function createUser(userObject) {
    return User.create(userObject);
}

// async function getAllUsers(query, sort, order, page, limit, skip, selectFields, populateFields) {
//     let data;
//     if (limit > 0) {
//         data = User.find(query)
//             // .select('name _id')  // Include _id in the select clause for exclusion
//             .sort({[sort]: order})
//             .skip(skip)
//             .limit(limit)
//             // .lean()
//             // .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
//     } else {
//         data = User.find(query)
//             // .select('name _id')  // Include _id in the select clause for exclusion
//             .sort({[sort]: order})
//             // .lean()
//             // .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
//     }
//     // console.log("data", data);
//     return await userReqObjExtractor.fetchUsers(data, selectFields, populateFields);
// }


async function getAllUsers(query, sort, order, page, limit, skip, selectFields, populateFields) {
    try {
        let queryObject
        console.log("query", query)
        if(limit > 0){
            queryObject = User.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit)
            ;
        }
        else{
            queryObject = User.find(query).sort({[sort]: order});
        }

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            const populateFieldsArray = populateFields.split(' ');
            const validPopulateFields = populateFieldsArray.filter(field => User.schema.path(field) != null);
            queryObject = queryObject.populate({
                path: validPopulateFields.join(' '), // Convert back to a string
                select: '_id name email employeeId buUserId password expiredAt shortName usersCount',
                options: {
                    lean: true, // Ensure the result is in plain JavaScript objects
                    transform: doc => {
                        // Rename _id to id within the populated item
                        const {_id, ...rest} = doc;
                        return {...rest, id: _id};
                    },
                },
            });
        }

        const results = await queryObject.lean();

        return results.map(result => {
            const {_id, ...rest} = result;
            return {...rest, id: _id};
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return null;
    }
}

async function getUser(query, selectFields, populateFields) {
    try {
        let queryObject = User.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => User.schema.path(field) != null);


            queryObject = queryObject.populate({
                path: validPopulateFields.join(' '), // Convert back to a string
                select: '_id name email employeeId buUserId permissions password expiredAt shortName usersCount positivePermissions negativePermissions',
                options: {
                    lean: true, // Ensure the result is in plain JavaScript objects
                    transform: doc => {
                        // Rename _id to id within the populated item
                        const { _id, ...rest } = doc;
                        return { ...rest, id: _id };
                    },
                },
            });
        }

        const result = await queryObject.lean();

        if (result) {
            const { _id, ...rest } = result;
            return { ...rest, id: _id };
        }

        return null;
    } catch (error) {
        console.error('Error in getUser:', error);
        return null;
    }
}


async function countUsers(query) {
    return User.countDocuments(query);
}


async function enableUser(query) {
    return User.updateOne(query, {$set: {isEnabled: true}});
}

async function enableUsers(query) {
    return User.updateMany(query, {$set: {isEnabled: true}});
}

async function disableUser(query) {
    return User.updateOne(query, {$set: {isEnabled: false}});
}

async function disableUsers(query) {
    return User.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteUser(query) {
    return User.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteUsers(query) {
    return User.updateMany(query, {$set: {isDeleted: true}});
}

async function updateUser(query, updateObject) {
    // Update the document using User.updateOne
    return User.updateOne(query, { $set: updateObject });
}

async function updateUsers(query, updateObject) {
    return User.updateMany(query, { $set: updateObject });
}

async function checkExistingUser(id, businessUnit) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUser = await User.findOne(query);
    return existingUser !== null;
}

async function checkExistingEmployeeIdForBusinessUnit(employeeId, businessUnit) {
    const query = {
        employeeId: {$regex: new RegExp(`^${employeeId}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameUser = await User.findOne(query);
    return existingNameUser !== null;
}

async function checkExistingEmailForBusinessUnit(email, businessUnit) {
    const query = {
        email: {$regex: new RegExp(`^${email}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameUser = await User.findOne(query);
    return existingNameUser !== null;
}

const returnInvalidUserIds = async (ids, businessUnit, department) => {

    let invalidUserIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserIds.length > 0) {
        return invalidUserIds;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    if(department) {
        query.department = department;
    }
    const existingUsers = await User.find(query).select('_id');

    const existingUserIds = existingUsers.map(user => user._id.toString());

    invalidUserIds.push(...ids.filter(id => !existingUserIds.includes(id)));

    return Array.from(new Set(invalidUserIds));
}

const returnUsersWithoutTeam = async (ids, businessUnit, department) => {

    let invalidUserIdsWithoutTeam = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserIdsWithoutTeam.length > 0) {
        return invalidUserIdsWithoutTeam;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false,
        team: null
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    if(department) {
        query.department = department;
    }
    const existingUsers = await User.find(query).select('_id');

    const existingUserIds = existingUsers.map(user => user._id.toString());

    invalidUserIdsWithoutTeam.push(...ids.filter(id => !existingUserIds.includes(id)));

    return Array.from(new Set(invalidUserIdsWithoutTeam));
}

const returnUsersWithSpecificTeam = async (ids, team, businessUnit, department) => {

    let invalidUserIdsWithSpecificTeam = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserIdsWithSpecificTeam.length > 0) {
        return invalidUserIdsWithSpecificTeam;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false,
        team: team
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    if(department) {
        query.department = department;
    }
    const existingUsers = await User.find(query).select('_id');

    const existingUserIds = existingUsers.map(user => user._id.toString());

    invalidUserIdsWithSpecificTeam.push(...ids.filter(id => !existingUserIds.includes(id)));

    return Array.from(new Set(invalidUserIdsWithSpecificTeam));
}






module.exports = {
    createUser,
    getAllUsers,
    countUsers,
    getUser,
    enableUser,
    enableUsers,
    disableUser,
    disableUsers,
    deleteUser,
    deleteUsers,
    updateUser,
    updateUsers,
    checkExistingUser,
    checkExistingEmailForBusinessUnit,
    checkExistingEmployeeIdForBusinessUnit,
    returnInvalidUserIds,
    returnUsersWithoutTeam,
    returnUsersWithSpecificTeam
};