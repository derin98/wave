const Permission = require('../../../../models/mongoDB/organizationManagement/permission/permission.model');
const mongoose = require('mongoose');
const {query} = require("express");
const UserPermission = require("../../../../models/mongoDB/userManagement/userPermission/userPermission.model");

async function createPermission(permissionObject) {
    return Permission.create(permissionObject);
}

async function getAllPermissions(query, sort, order, page, limit, skip, selectFields, populateFields) {
    // if (limit > 0) {
    //     return Permission.find(query)
    //         .select('name _id')  // Include _id in the select clause for exclusion
    //         .sort({[sort]: order})
    //         .skip(skip)
    //         .limit(limit)
    //         .lean()
    //         .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    // } else {
    //     return Permission.find(query)
    //         .select('name _id')  // Include _id in the select clause for exclusion
    //         .sort({[sort]: order})
    //         .lean()
    //         .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    // }
    try {
        let queryObject
        console.log("query", query)
        if(limit > 0){
            queryObject = Permission.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit)
            ;
        }
        else{
            queryObject = Permission.find(query).sort({[sort]: order});
        }

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            const populateFieldsArray = populateFields.split(' ');
            const validPopulateFields = populateFieldsArray.filter(field => Permission.schema.path(field) != null);
            if (validPopulateFields.length > 0)  {
                queryObject = queryObject.populate({
                    path: validPopulateFields.join(' '), // Convert back to a string
                    select: '_id name permissionGroup',
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
        }

        const results = await queryObject.lean();

        return results.map(result => {
            const {_id, ...rest} = result;
            return {...rest, id: _id};
        });
    } catch (error) {
        console.error('Error in getAllPermissions:', error);
        return null;
    }
}

async function countPermissions(query) {
    return Permission.countDocuments(query);
}

async function getPermission(query, selectFields, populateFields) {
    try {
        let queryObject = Permission.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => Permission.schema.path(field) != null);


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
        console.error('Error in getPermission:', error);
        return null;
    }
}

async function getPermissions(query, selectFields, populateFields) {
    try {
        let queryObject = Permission.find(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => Permission.schema.path(field) != null);

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

        const results = await queryObject.lean();

        if (results && results.length > 0) {
            const formattedResults = results.map(result => {
                const { _id, ...rest } = result;
                return { ...rest, id: _id };
            });

            return formattedResults;
        }

        return [];
    } catch (error) {
        console.error('Error in getPermissions:', error);
        return [];
    }
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
    getPermissions,
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