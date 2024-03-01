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
        if(limit > 0){
            let queryObject = User.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit)
            ;

            if (selectFields) {
                queryObject = queryObject.select(selectFields);
            }

            if (populateFields) {
                // Convert populateFields string to an array
                const populateFieldsArray = populateFields.split(',');

                // Remove unwanted fields from populateFields
                const populateFieldsWithoutSystemFields = populateFieldsArray.filter(field => !['createdAt', 'updatedAt', '__v', 'isEnabled', 'isDeleted', 'createdBy', 'updatedBy', 'userTypeId', 'departmentId', 'businessUnitId', 'permissionIds'].includes(field.trim()));

                queryObject = queryObject.populate({
                    path: populateFieldsWithoutSystemFields.join(' '), // Convert back to a string
                    select: '-createdAt -updatedAt -__v -isEnabled -isDeleted -createdBy -updatedBy -userTypeId -departmentId -businessUnitId -permissionIds',
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
        }
        else{
            let queryObject = User.find(query);

            if (selectFields) {
                queryObject = queryObject.select(selectFields);
            }

            if (populateFields) {
                // Convert populateFields string to an array
                const populateFieldsArray = populateFields.split(',');

                // Remove unwanted fields from populateFields
                const populateFieldsWithoutSystemFields = populateFieldsArray.filter(field => !['createdAt', 'updatedAt', '__v', 'isEnabled', 'isDeleted', 'createdBy', 'updatedBy', 'userTypeId', 'departmentId', 'businessUnitId', 'permissionIds'].includes(field.trim()));

                queryObject = queryObject.populate({
                    path: populateFieldsWithoutSystemFields.join(' '), // Convert back to a string
                    select: '-createdAt -updatedAt -__v -isEnabled -isDeleted -createdBy -updatedBy -userTypeId -departmentId -businessUnitId -permissionIds',
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
        }
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return null;
    }
}


async function countUsers(query) {
    return User.countDocuments(query);
}



async function getUser(query, selectFields, populateFields) {
    try {
        let queryObject = User.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            console.log("populateFields", populateFields)
            const populateFieldsArray = populateFields.split(' ');
            console.log("populateFieldsArray", populateFieldsArray)
            // Remove unwanted fields from populateFields
            const populateFieldsWithoutSystemFields = populateFieldsArray.filter(field => !['createdAt', 'updatedAt', '__v', 'isEnabled', 'isDeleted', 'createdBy', 'updatedBy', 'userTypeId', 'departmentId', 'businessUnitId'].includes(field.trim()));
            console.log("populateFieldsWithoutSystemFields", populateFieldsWithoutSystemFields)
            queryObject = queryObject.populate({
                path: populateFieldsWithoutSystemFields.join(' '), // Convert back to a string
                select: '_id name email employeeId userId permissionIds password expiredAt shortName userCount',
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
    return User.updateOne(query, {$set: updateObject});
}

async function checkExistingUserId(id, businessUnitId) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingUser = await User.findOne(query);
    return existingUser !== null;
}

async function checkExistingEmployeeIdForBusinessUnit(employeeId, businessUnitId) {
    const query = {
        employeeId: {$regex: new RegExp(`^${employeeId}$`, 'i')},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingNameUser = await User.findOne(query);
    return existingNameUser !== null;
}

async function checkExistingEmailForBusinessUnit(email, businessUnitId) {
    const query = {
        email: {$regex: new RegExp(`^${email}$`, 'i')},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingNameUser = await User.findOne(query);
    return existingNameUser !== null;
}

const returnInvalidUserIds = async (ids, businessUnitId) => {

    let invalidUserIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserIds.length > 0) {
        return invalidUserIds;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingUsers = await User.find(query).select('_id');

    const existingUserIds = existingUsers.map(user => user._id.toString());

    invalidUserIds.push(...ids.filter(id => !existingUserIds.includes(id)));

    return Array.from(new Set(invalidUserIds));
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
    checkExistingUserId,
    checkExistingEmailForBusinessUnit,
    checkExistingEmployeeIdForBusinessUnit,
    returnInvalidUserIds
};