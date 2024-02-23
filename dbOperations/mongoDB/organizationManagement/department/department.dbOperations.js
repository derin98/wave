const Department = require('../../../../models/mongoDB/organizationManagement/department/department.model');
const mongoose = require('mongoose');

async function createDepartment(departmentObject) {
    return Department.create(departmentObject);
}

async function getAllDepartments(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return Department.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return Department.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countDepartments(query) {
    return Department.countDocuments(query);
}

async function getDepartment(query) {
    const result = await Department.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
}

async function enableDepartment(query) {
    return Department.updateOne(query, {$set: {isEnabled: true}});
}

async function enableDepartments(query) {
    return Department.updateMany(query, {$set: {isEnabled: true}});
}

async function disableDepartment(query) {
    return Department.updateOne(query, {$set: {isEnabled: false}});
}

async function disableDepartments(query) {
    return Department.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteDepartment(query) {
    return Department.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteDepartments(query) {
    return Department.updateMany(query, {$set: {isDeleted: true}});
}

async function updateDepartment(query, updateObject) {
    return Department.updateOne(query, {$set: updateObject});
}

async function checkExistingDepartmentId(id, businessUnitId) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingDepartment = await Department.findOne(query);
    return existingDepartment !== null;
}

async function checkExistingNameForBusinessUnit(name, businessUnitId) {
    const query = {
        name: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingNameDepartment = await Department.findOne(query);
    return existingNameDepartment !== null;
}

const returnInvalidDepartmentIds = async (ids, businessUnitId) => {

    let invalidDepartmentIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidDepartmentIds.length > 0) {
        return invalidDepartmentIds;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    const existingDepartments = await Department.find(query).select('_id');

    const existingDepartmentIds = existingDepartments.map(department => department._id.toString());

    invalidDepartmentIds.push(...ids.filter(id => !existingDepartmentIds.includes(id)));

    return Array.from(new Set(invalidDepartmentIds));
}

module.exports = {
    createDepartment,
    getAllDepartments,
    countDepartments,
    getDepartment,
    enableDepartment,
    enableDepartments,
    disableDepartment,
    disableDepartments,
    deleteDepartment,
    deleteDepartments,
    updateDepartment,
    checkExistingDepartmentId,
    checkExistingNameForBusinessUnit,
    returnInvalidDepartmentIds
};