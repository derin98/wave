const DepartmentOperations = require('../../../../dbOperations/mongoDB/organizationManagement/department/department.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const departmentResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/department/department.resObjConverter');
const BusinessUnitOperations = require("../../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations");


async function createDepartment(departmentObject) {
    const department = await DepartmentOperations.createDepartment(departmentObject);
    return departmentResObjConverter.departmentCreateResponse(department);
}

async function getAllDepartments(req) {
    let query = {
        isEnabled: true,
        isDeleted: false,
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    console.log("query", query)
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countDepartments = await DepartmentOperations.countDepartments(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countDepartments, []);
    }
    const departments = await DepartmentOperations.getAllDepartments(query, sort, order, page, limit, skip);
    const totalPages = countDepartments === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countDepartments / limit));

    return paginationHandler.paginationResObj(page, totalPages, countDepartments, departments);
}

async function getDepartment(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.getDepartment(query);
}

async function getDepartmentByName(name, businessUnit) {

    let query = {
        // isEnabled : true,
        isDeleted : false,
        name : name
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.getDepartment(query);
}

async function enableDepartment(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.enableDepartment(query);
}

async function enableDepartments(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.enableDepartments(query);
}

async function disableDepartment(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.disableDepartment(query);
}


async function disableDepartments(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.disableDepartments(query);
}

async function deleteDepartment(id, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.deleteDepartment(query);
}

async function deleteDepartments(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.deleteDepartments(query);
}

async function updateDepartment(id, updateObject, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await DepartmentOperations.updateDepartment(query, updateObject);
}

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartment,
    getDepartmentByName,
    enableDepartment,
    enableDepartments,
    disableDepartment,
    disableDepartments,
    deleteDepartment,
    deleteDepartments,
    updateDepartment
};