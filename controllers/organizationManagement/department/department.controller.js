/**
 * This is the controller for the department resource
 */

const departmentReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/department/department.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const departmentManager = require('../../../managers/internalManagers/organizationManagement/department/department.managers');
/**
 * Create a department
 *
 */

exports.createDepartment = async (req, res) => {
    try {
        const departmentReqObj = departmentReqObjExtractor.createDepartmentObject(req);
        const department = await departmentManager.createDepartment(departmentReqObj);
        const message = "Department created successfully";
        return apiResponseHandler.successResponse(res, message, department, 201);
    } catch (err) {
        console.log("Error while creating the department", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Get all departments
 *
 */

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await departmentManager.getAllDepartments(req);
        const message = "Departments fetched successfully";
        return apiResponseHandler.successResponse(res, message, departments, 200);
    } catch (err) {
        console.log("Error while fetching departments", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a department
 *
 */

exports.getDepartment = async (req, res) => {
    try {
        const department = await departmentManager.getDepartment(req.params.department, req.businessUnit);

        if (!department) {
            return apiResponseHandler.errorResponse(res, "Department not found", 404, null);
        }
        const message = "Department fetched successfully";
        return apiResponseHandler.successResponse(res, message, department, 200);
    } catch (err) {
        console.log("Error while fetching department", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}

/**
 * Enable a department
 *
 */

exports.enableDepartment = async (req, res) => {
    try {
        const department = await departmentManager.enableDepartment(req.params.department, req.businessUnit);
        const message = "Department enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling department", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a department
 *
 */


exports.disableDepartment = async (req, res) => {
    try {
        const department = await departmentManager.disableDepartment(req.params.department, req.businessUnit);
        const message = "Department disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling department", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable departments
 *
 */


exports.enableDepartments = async (req, res) => {
    try {
        await departmentManager.enableDepartments(req.body.departments, req.businessUnit, req.businessUnit);
        const message = "Departments enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling departments", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable departments
 *
 */


exports.disableDepartments = async (req, res) => {
    try {
        await departmentManager.disableDepartments(req.body.departments, req.businessUnit);
        const message = "Departments disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling departments", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a department
 *
 */

exports.deleteDepartment = async (req, res) => {
    try {
        await departmentManager.deleteDepartment(req.params.department, req.businessUnit);
        const message = "Department deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting department", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete departments
 *
 */

exports.deleteDepartments = async (req, res) => {
    try {
        await departmentManager.deleteDepartments(req.body.departments, req.businessUnit);
        const message = "Departments deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting departments", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update a department
 *
 */

exports.updateDepartment = async (req, res) => {
    try {
        const departmentReqObj = departmentReqObjExtractor.updateDepartmentObject(req);
        const department = await departmentManager.updateDepartment(req.params.department, departmentReqObj, req.businessUnit);
        const message = "Department updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating department", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}