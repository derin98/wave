const PermissionGroup = require('../../../../models/mongoDB/organizationManagement/permissionGroup/permissionGroup.model');
const mongoose = require('mongoose');

async function createPermissionGroup(permissionGroupObject) {
    return PermissionGroup.create(permissionGroupObject);
}

async function getAllPermissionGroups(query, sort, order, page, limit, skip, selectFields, populateFields) {
    // if (limit > 0) {
    //     return PermissionGroup.find(query)
    //         .select('name _id')  // Include _id in the select clause for exclusion
    //         .sort({[sort]: order})
    //         .skip(skip)
    //         .limit(limit)
    //         .lean()
    //         .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    // } else {
    //     return PermissionGroup.find(query)
    //         .select('name _id')  // Include _id in the select clause for exclusion
    //         .sort({[sort]: order})
    //         .lean()
    //         .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    // }

    try {
        let queryObject
        console.log("query", query)
        if(limit > 0){
            queryObject = PermissionGroup.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit)
            ;
        }
        else{
            queryObject = PermissionGroup.find(query).sort({[sort]: order});
        }

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            const populateFieldsArray = populateFields.split(' ');
            const validPopulateFields = populateFieldsArray.filter(field => PermissionGroup.schema.path(field) != null);
            if (validPopulateFields.length > 0)  {
                queryObject = queryObject.populate({
                    path: validPopulateFields.join(' '), // Convert back to a string
                    select: '_id name',
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
        console.error('Error in getAllPermissionGroups:', error);
        return null;
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
async function getPermissionGroup(query, selectFields, populateFields) {
    try {
        let queryObject = PermissionGroup.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => PermissionGroup.schema.path(field) != null);

            if (validPopulateFields.length > 0) {
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
            } else {
                console.warn('No valid fields to populate.');
            }
        }

        const result = await queryObject.lean();

        if (result) {
            const { _id, ...rest } = result;
            return { ...rest, id: _id };
        }

        return null;
    } catch (error) {
        console.error('Error in getPermissionGroup:', error);
        return null;
    }
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

async function checkExistingPermissionGroup(id, businessUnit) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingPermissionGroup = await PermissionGroup.findOne(query);
    return existingPermissionGroup !== null;
}

async function checkExistingNameForBusinessUnit(name, businessUnit) {
    const query = {
        name: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNamePermissionGroup = await PermissionGroup.findOne(query);
    return existingNamePermissionGroup !== null;
}

const returnInvalidPermissionGroups = async (ids, businessUnit) => {

    let invalidPermissionGroups = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidPermissionGroups.length > 0) {
        return invalidPermissionGroups;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingPermissionGroups = await PermissionGroup.find(query).select('_id');

    const filterIds = existingPermissionGroups.map(permissionGroup => permissionGroup._id.toString());

    invalidPermissionGroups.push(...ids.filter(id => !filterIds.includes(id)));

    return Array.from(new Set(invalidPermissionGroups));
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
    checkExistingPermissionGroup,
    checkExistingNameForBusinessUnit,
    returnInvalidPermissionGroups
};