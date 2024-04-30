/**
 * This file will contain the middlewares for valdiating the department request body
 */
const DepartmentDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/department/department.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");


validateCreateDepartmentRequestBody = async (req, res, next) => {
    // Validate request

    if (!req.businessUnit){
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit Id must be a non-empty string",
            400,
            null
        );
    }

    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Department name must be a non-empty string",
            400,
            null
        );
    }

    // Check if the provided name already exists in the database
    const existingNameDepartment = await DepartmentDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
    if (existingNameDepartment) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Department name already exists for the business unit",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Department isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdateDepartmentRequestBody = async (req, res, next) => {
    // Validate request

    if (!req.businessUnit){
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit Id must be a non-empty string",
            400,
            null
        );
    }


    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit name must be a non-empty string",
                400,
                null
            );
        }

        const existingNameDepartment = await DepartmentDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
        if (existingNameDepartment) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Department name already exists for the business unit",
                400,
                null
            );
        }
        if (req.body.isEnabled !== undefined) {
            if (typeof req.body.isEnabled !== 'boolean') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! BusinessUnit isEnabled should be a boolean",
                    400,
                    null
                );
            }
        }
    }
    next();
}

validateDepartment = async (req, res, next) => {

    if(req.body.department || req.params.department || req.query.department){// Check if department is in req.params
        if (req.params.department && typeof req.params.department === 'string') {
            req.department = req.params.department;
        }
        else if (req.query.department && typeof req.query.department === 'string') {
            req.department = req.query.department;
        }
        // If not, check if department is in req.body
        else if (req.body.department && typeof req.body.department === 'string') {
            req.department = req.body.department;
        }
        // If department is not in req.params or req.body, return an error response
        else {
            return apiResponseHandler.errorResponse(
                res,
                "Department id must be a non-empty string in req.params or req.body",
                400,
                null
            );
        }



        // Check if the department with the given ID exists
        let checkExistingDepartment = await DepartmentDbOperations.checkExistingDepartment(req.department, req.businessUnit);

        if (checkExistingDepartment) {
            next();
        } else {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Department does not exist",
                400,
                null
            );
        }
    }
    else {
        next();
    }
}

validateDepartments = async (req, res, next) => {

    if (!req.body.departments || !Array.isArray(req.body.departments) || req.body.departments.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Department ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.departments.length; i++) {
        if (typeof req.body.departments[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Department ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let invalidDepartments = await DepartmentDbOperations.returnInvalidDepartments(req.body.departments, req.businessUnit);
    if (invalidDepartments.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Department ids",
            400,
            { invalidDepartments }
        );
    }
    next();
}

validateDepartmentsFromQuery = async (req, res, next) => {

    if(req.query.departments){
        //convert the string to array

        let departments = req.query.departments.split(",");

        if (!departments || !Array.isArray(departments) || departments.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Department ids must be a non-empty string with comma separated values",
                400,
                null
            );
        }

        let invalidDepartments = await DepartmentDbOperations.returnInvalidDepartments(departments, req.businessUnit);
        if (invalidDepartments.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid Department ids",
                400,
                { invalidDepartments }
            );
        }

    req.departments = departments;
    }
    next();
}

const verifyDepartmentReqBody = {
    validateCreateDepartmentRequestBody: validateCreateDepartmentRequestBody,
    validateUpdateDepartmentRequestBody: validateUpdateDepartmentRequestBody,
    validateDepartment: validateDepartment,
    validateDepartments: validateDepartments,
    validateDepartmentsFromQuery: validateDepartmentsFromQuery
};


module.exports = verifyDepartmentReqBody

