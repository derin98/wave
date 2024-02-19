/**
 * This file will contain the middlewares for valdiating the department request body
 */
const DepartmentDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/department/department.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");


validateCreateDepartmentRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Department name must be a non-empty string",
            400,
            null
        );
    }

    // Check if the provided name already exists in the database
    const existingNameDepartment = await DepartmentDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnitId);
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
    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit name must be a non-empty string",
                400,
                null
            );
        }

        const existingNameDepartment = await DepartmentDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnitId);
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

validateDepartmentId = async (req, res, next) => {
    if (!req.params.id || typeof req.params.id !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Department id must be a non-empty string",
            400,
            null
        );
    }

    let checkExistingDepartment = await DepartmentDbOperations.checkExistingDepartmentId(req.params.id, req.businessUnitId);
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

validateDepartmentIds = async (req, res, next) => {

    if (!req.body.ids || !Array.isArray(req.body.ids) || req.body.ids.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Department ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.ids.length; i++) {
        if (typeof req.body.ids[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Department ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let invalidDepartmentIds = await DepartmentDbOperations.returnInvalidDepartmentIds(req.body.ids, req.businessUnitId);
    if (invalidDepartmentIds.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Department ids",
            400,
            { invalidDepartmentIds }
        );
    }
    next();
}

const verifyDepartmentReqBody = {
    validateCreateDepartmentRequestBody: validateCreateDepartmentRequestBody,
    validateUpdateDepartmentRequestBody: validateUpdateDepartmentRequestBody,
    validateDepartmentId: validateDepartmentId,
    validateDepartmentIds: validateDepartmentIds
};


module.exports = verifyDepartmentReqBody

