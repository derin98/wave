const UserPermission = require('../../../../models/mongoDB/userManagement/userPermission/userPermission.model');
const mongoose = require('mongoose');
async function createUserPermission(userPermissionObject) {
    return UserPermission.create(userPermissionObject);
}

async function getAllUserPermissions(query, sort, order, page, limit, skip, selectFields, populateFields) {
    try {
        let queryObject
        if(limit > 0){
            queryObject = UserPermission.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit)
            ;
        }
        else{
            queryObject = UserPermission.find(query).sort({[sort]: order});
        }

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            const populateFieldsArray = populateFields.split(' ');
            const validPopulateFields = populateFieldsArray.filter(field => UserPermission.schema.path(field) != null);
            queryObject = queryObject.populate({
                path: validPopulateFields.join(' '), // Convert back to a string
                select: '_id name email employeeId userPermissionId password expiredAt shortName usersCount',
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
        console.error('Error in getAllUserPermissions:', error);
        return null;
    }
}

async function getUserPermission(query, selectFields, populateFields) {
    try {
        let queryObject = UserPermission.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => UserPermission.schema.path(field) != null);


            queryObject = queryObject.populate({
                path: validPopulateFields.join(' '), // Convert back to a string
                select: '_id name',
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
        console.error('Error in getUserPermission:', error);
        return null;
    }
}


async function countUserPermissions(query) {
    return UserPermission.countDocuments(query);
}




async function updateUserPermission(query, updateObject) {
    return UserPermission.updateOne(query, {$set: updateObject});
}
async function updateUserPermissions(bulkUpdateOperations) {

    return await UserPermission.bulkWrite(bulkUpdateOperations);

}


async function checkExistingUserPermissionId(id, businessUnit) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id}
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserPermission = await UserPermission.findOne(query);
    return existingUserPermission !== null;
}

const returnInvalidUserPermissionIds = async (ids, businessUnit) => {

    let invalidUserPermissionIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidUserPermissionIds.length > 0) {
        return invalidUserPermissionIds;
    }

    const query = {
        _id: {$in: ids}
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingUserPermissions = await UserPermission.find(query).select('_id');

    const existingUserPermissionIds = existingUserPermissions.map(userPermissions => userPermissions._id.toString());

    invalidUserPermissionIds.push(...ids.filter(id => !existingUserPermissionIds.includes(id)));

    return Array.from(new Set(invalidUserPermissionIds));
}

module.exports = {
    createUserPermission,
    getAllUserPermissions,
    countUserPermissions,
    getUserPermission,
    updateUserPermission,
    updateUserPermissions,
    checkExistingUserPermissionId,
    returnInvalidUserPermissionIds
};