const Designation = require('../../../../models/mongoDB/organizationManagement/designation/designation.model');
const mongoose = require('mongoose');
const {query} = require("express");

async function createDesignation(designationObject) {
    return Designation.create(designationObject);
}

async function getAllDesignations(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return Designation.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return Designation.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countDesignations(query) {
    return Designation.countDocuments(query);
}

async function getDesignation(query) {
    const result = await Designation.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
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
    checkExistingDesignation,
    checkExistingNameForUserType,
    returnInvalidDesignations
};