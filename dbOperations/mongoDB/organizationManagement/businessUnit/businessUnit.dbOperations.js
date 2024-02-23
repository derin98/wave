const BusinessUnit = require("../../../../models/mongoDB/organizationManagement/businessUnit/businessUnit.model");
const mongoose = require("mongoose");

async function createBusinessUnit(businessUnitObject) {
    return BusinessUnit.create(businessUnitObject);
}

async function getAllBusinessUnits(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return BusinessUnit.find(query)
            .select('name shortName _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return BusinessUnit.find(query)
            .select('name shortName _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countBusinessUnits(query) {
    return BusinessUnit.countDocuments(query)
}

async function getBusinessUnit(query) {

    const result = await BusinessUnit.findOne(query).select('name shortName _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enableBusinessUnit(query) {

    return BusinessUnit.updateOne(query, {$set: {isEnabled: true}});

}

async function enableBusinessUnits(query) {

    return BusinessUnit.updateMany(query, {$set: {isEnabled: true}});
}

async function disableBusinessUnit(query) {

    return BusinessUnit.updateOne(query, {$set: {isEnabled: false}});

}

async function disableBusinessUnits(query) {

    return BusinessUnit.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteBusinessUnit(query) {

    return BusinessUnit.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteBusinessUnits(query) {

    return BusinessUnit.updateMany(query, {$set: {isDeleted: true}});
}

async function updateBusinessUnit(query, update) {

    return BusinessUnit.updateOne(query, update);
}

async function checkExistingName(name) {
    const existingNameBusinessUnit = await BusinessUnit.findOne({name: {$regex: new RegExp(`^${name}$`, 'i')}})
    return existingNameBusinessUnit !== null;
}

// Check if the provided shortName already exists in the database
const checkExistingShortName = async (shortName) => {
    const existingShortNameBusinessUnit = await BusinessUnit.findOne({shortName: {$regex: new RegExp(`^${shortName}$`, 'i')}});
    return existingShortNameBusinessUnit !== null;
};

const checkExistingBusinessUnit = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }

    const existingBusinessUnit = await BusinessUnit.findOne({_id: id, isDeleted: false});
    console.log("existingBusinessUnit", existingBusinessUnit)
    return existingBusinessUnit !== null;
};

const returnInvalidBusinessUnitIds = async (ids) => {

    let invalidBusinessUnitIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidBusinessUnitIds.length > 0) {
        return invalidBusinessUnitIds;
    }

    const existingBusinessUnits = await BusinessUnit.find({
        _id: { $in: ids },
        isDeleted: false
    }).select('_id');

    const validBusinessUnitIds = existingBusinessUnits.map(existingBusinessUnit => existingBusinessUnit._id.toString());

    // Use spread (...) to add individual elements instead of an array
    invalidBusinessUnitIds.push(...ids.filter(id => !validBusinessUnitIds.includes(id)));

    return Array.from(new Set(invalidBusinessUnitIds));
};


module.exports = {
    createBusinessUnit,
    getAllBusinessUnits,
    checkExistingName,
    checkExistingShortName,
    countBusinessUnits,
    getBusinessUnit,
    checkExistingBusinessUnit,
    enableBusinessUnit,
    enableBusinessUnits,
    disableBusinessUnit,
    disableBusinessUnits,
    returnInvalidBusinessUnitIds,
    deleteBusinessUnit,
    deleteBusinessUnits,
    updateBusinessUnit
    // Add other database-related functions as needed
};