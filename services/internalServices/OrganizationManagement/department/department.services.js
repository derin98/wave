const DepartmentOperations = require('../../../../dbOperations/mongoDB/organizationManagement/department/department.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const departmentResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/department/department.resObjConverter');


async function createDepartment(departmentObject) {
    const department = await DepartmentOperations.createDepartment(departmentObject);
    return departmentResObjConverter.departmentCreateResponse(department);
}

async function getAllDepartments(req) {
    let query = {
        isEnabled: true,
        isDeleted: false
    };
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

async function getDepartment(id) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    return await DepartmentOperations.getDepartment(query);
}

async function enableDepartment(id) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    return await DepartmentOperations.enableDepartment(query);
}

async function enableDepartments(ids) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    return await DepartmentOperations.enableDepartments(query);
}

async function disableDepartment(id) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    return await DepartmentOperations.disableDepartment(query);
}


async function disableDepartments(ids) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    return await DepartmentOperations.disableDepartments(query);
}

async function deleteDepartment(id) {
    let query = {
        _id: id,
        isDeleted: false
    };
    return await DepartmentOperations.deleteDepartment(query);
}

async function deleteDepartments(ids) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    return await DepartmentOperations.deleteDepartments(query);
}

async function updateDepartment(id, updateObject) {
    let query = {
        _id: id,
        isDeleted: false
    };
    return await DepartmentOperations.updateDepartment(query, updateObject);
}

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartment,
    enableDepartment,
    enableDepartments,
    disableDepartment,
    disableDepartments,
    deleteDepartment,
    deleteDepartments,
    updateDepartment
};