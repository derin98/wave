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

// async function getBusinessUnit(query, selectFields, populateFields) {
//
//     const result = await BusinessUnit.findOne(query).select('name shortName _id').populate(populateFields).lean();
//     if (result) {
//         const {_id, ...rest} = result;
//         return {...rest, id: _id};
//     }
//     return null;
// }

async function getBusinessUnit(query, selectFields, populateFields) {
    try {
        let queryObject = BusinessUnit.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => BusinessUnit.schema.path(field) != null);


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
        console.error('Error in getBusinessUnit:', error);
        return null;
    }
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

const returnInvalidBusinessUnits = async (ids) => {

    let invalidBusinessUnits = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidBusinessUnits.length > 0) {
        return invalidBusinessUnits;
    }

    const existingBusinessUnits = await BusinessUnit.find({
        _id: { $in: ids },
        isDeleted: false
    }).select('_id');

    const validBusinessUnits = existingBusinessUnits.map(existingBusinessUnit => existingBusinessUnit._id.toString());

    // Use spread (...) to add individual elements instead of an array
    invalidBusinessUnits.push(...ids.filter(id => !validBusinessUnits.includes(id)));

    return Array.from(new Set(invalidBusinessUnits));
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
    returnInvalidBusinessUnits,
    deleteBusinessUnit,
    deleteBusinessUnits,
    updateBusinessUnit
    // Add other database-related functions as needed
};