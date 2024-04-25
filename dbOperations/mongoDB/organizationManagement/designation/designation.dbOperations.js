const Designation = require('../../../../models/mongoDB/organizationManagement/designation/designation.model');
const mongoose = require('mongoose');
const {query} = require("express");
const User = require("../../../../models/mongoDB/userManagement/user/user.model");

async function createDesignation(designationObject) {
    return Designation.create(designationObject);
}

async function getAllDesignations(query, sort, order, page, limit, skip, selectFields, populateFields) {
    // if (limit > 0) {
    //     return Designation.find(query)
    //         .select('name _id')  // Include _id in the select clause for exclusion
    //         .sort({[sort]: order})
    //         .skip(skip)
    //         .limit(limit)
    //         .lean()
    //         .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    // } else {
    //     return Designation.find(query)
    //         .select('name _id')  // Include _id in the select clause for exclusion
    //         .sort({[sort]: order})
    //         .lean()
    //         .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    // }
    try {
        let queryObject
        console.log("query", query)
        if(limit > 0){
            queryObject = Designation.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit)
            ;
        }
        else{
            queryObject = Designation.find(query).sort({[sort]: order});
        }

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            const populateFieldsArray = populateFields.split(' ');
            const validPopulateFields = populateFieldsArray.filter(field => Designation.schema.path(field) != null);
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
        console.error('Error in getAllDesignations:', error);
        return null;
    }
}

async function countDesignations(query) {
    return Designation.countDocuments(query);
}

async function getDesignation(query, selectFields, populateFields) {
    try {
        let queryObject = Designation.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => Designation.schema.path(field) != null);

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
        console.error('Error in getDesignation:', error);
        return null;
    }
}


async function enableDesignation(query) {
    return Designation.updateOne(query, {$set: {isEnabled: true}});
}

async function enableDesignations(query) {
    return Designation.updateMany(query, {$set: {isEnabled: true}});
}

async function disableDesignation(query) {
    return Designation.updateOne(query, {$set: {isEnabled: false}});
}

async function disableDesignations(query) {
    return Designation.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteDesignation(query) {
    return Designation.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteDesignations(query) {
    return Designation.updateMany(query, {$set: {isDeleted: true}});
}

async function updateDesignation(query, updateObject) {
    return Designation.updateOne(query, {$set: updateObject});
}
async function updateDesignations(query, updateObject) {
    return Designation.updateMany(query, {$set: updateObject});
}

async function checkExistingDesignation(id, businessUnit, userType) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }

    const query = {_id: id, isDeleted: false};

    if (businessUnit) {
        query.businessUnit = businessUnit;
    }

    if (userType) {
        query.userType = userType;
    }

    const existingDesignation = await Designation.findOne(query);
    console.log('existingDesignation', existingDesignation, userType, id)
    return existingDesignation;
}

async function checkExistingNameForUserType(name, userType, businessUnit) {
    const query = {name: {$regex: new RegExp(`^${name}$`, 'i')}, isDeleted: false, userType: userType }
    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingNameDesignation = await Designation.findOne(query);
    return existingNameDesignation !== null;
}

const returnInvalidDesignations = async (ids, businessUnit) => {

    let invalidDesignations = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidDesignations.length > 0) {
        return invalidDesignations;
    }
    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if (businessUnit) {
        query.businessUnit = businessUnit;
    }
    const existingDesignations = await Designation.find(query).select('_id');

    const filterIds = existingDesignations.map(designation => designation._id.toString());

    invalidDesignations.push(...ids.filter(id => !filterIds.includes(id)));

    return Array.from(new Set(invalidDesignations));
}

module.exports = {
    createDesignation,
    getAllDesignations,
    countDesignations,
    getDesignation,
    enableDesignation,
    enableDesignations,
    disableDesignation,
    disableDesignations,
    deleteDesignation,
    deleteDesignations,
    updateDesignation,
    updateDesignations,
    checkExistingDesignation,
    checkExistingNameForUserType,
    returnInvalidDesignations
};