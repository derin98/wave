const DesignationOperations = require('../../../../dbOperations/mongoDB/organizationManagement/designation/designation.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const designationResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/designation/designation.resObjConverter');


async function createDesignation(designationObject) {
    const designation = await DesignationOperations.createDesignation(designationObject);
    return designationResObjConverter.designationCreateResponse(designation);
}

async function getAllDesignations(req) {
    let query = {
        isEnabled: true,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    if(req.userType) {
        query.userType = req.userType;
    }
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countDesignations = await DesignationOperations.countDesignations(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countDesignations, []);
    }
    const designations = await DesignationOperations.getAllDesignations(query, sort, order, page, limit, skip);
    const totalPages = countDesignations === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countDesignations / limit));

    return paginationHandler.paginationResObj(page, totalPages, countDesignations, designations);
}

async function getDesignation(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.getDesignation(query);
}

async function getDesignationByName(name, businessUnit) {
    let query = {
        name: name,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.getDesignation(query);
}

async function enableDesignation(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.enableDesignation(query);
}

async function enableDesignations(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.enableDesignations(query);
}

async function disableDesignation(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.disableDesignation(query);
}


async function disableDesignations(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.disableDesignations(query);
}

async function deleteDesignation(id, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.deleteDesignation(query);
}

async function deleteDesignations(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.deleteDesignations(query);
}

async function updateDesignation(id, updateObject, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DesignationOperations.updateDesignation(query, updateObject);
}

module.exports = {
    createDesignation,
    getAllDesignations,
    getDesignation,
    enableDesignation,
    enableDesignations,
    disableDesignation,
    disableDesignations,
    deleteDesignation,
    deleteDesignations,
    updateDesignation,
    getDesignationByName

};