/**
 * This file will contain the middlewares for valdiating the userType request body
 */
const UserTypeDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/userType/userType.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");
const BusinessUnitDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations");

validateCreateUserTypeRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "UserType name must be a non-empty string",
            400,
            null
        );
    }

    if (!req.businessUnitId) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit Id must be a non-empty string",
            400,
            null
        );
    }
    // Check if the provided name already exists in the database
    const existingNameUserType = await UserTypeDbOperations.checkExistingNameForDepartment(req.body.name, req.params.departmentId, req.businessUnitId);
    if (existingNameUserType) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! UserType name already exists for the department",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! UserType isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdateUserTypeRequestBody = async (req, res, next) => {
    // Validate request
    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "UserType name must be a non-empty string",
                400,
                null
            );
        }

        const existingNameUserType = await UserTypeDbOperations.checkExistingNameForDepartment(req.body.name, req.departmentId, req.businessUnitId);
        if (existingNameUserType) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! UserType name already exists for the department",
                400,
                null
            );
        }
        if (req.body.isEnabled !== undefined) {
            if (typeof req.body.isEnabled !== 'boolean') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! UserType isEnabled should be a boolean",
                    400,
                    null
                );
            }
        }
    }
    next();
}

validateUserTypeId = async (req, res, next) => {

    // Check if userTypeId is in req.params
    if (req.params.userTypeId && typeof req.params.userTypeId === 'string') {
        req.userTypeId = req.params.userTypeId;
    }
    // If not, check if userTypeId is in req.body
    else if (req.body.userTypeId && typeof req.body.userTypeId === 'string') {
        req.userTypeId = req.body.userTypeId;
    }
    // If userTypeId is not in req.params or req.body, return an error response
    else {
        return apiResponseHandler.errorResponse(
            res,
            "UserType id must be a non-empty string in req.params or req.body",
            400,
            null
        );
    }

    // Check if the department with the given ID exists
    let checkExistingUserType = await UserTypeDbOperations.checkExistingUserTypeId(req.params.userTypeId, req.businessUnitId, req.departmentId);

    if (checkExistingUserType) {
        req.departmentId = checkExistingUserType.departmentId;
        next();
    } else {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! User Type does not exist",
            400,
            null
        );
    }
}

validateUserTypeIds = async (req, res, next) => {

    if (!req.body.userTypeIds || !Array.isArray(req.body.userTypeIds) || req.body.userTypeIds.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "UserType ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.userTypeIds.length; i++) {
        if (typeof req.body.userTypeIds[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "UserType ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }
    let invalidUserTypeIds = await UserTypeDbOperations.returnInvalidUserTypeIds(req.body.userTypeIds, req.businessUnitId);
    if (invalidUserTypeIds.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid UserType ids",
            400,
            { invalidUserTypeIds }
        );
    }
    next();
}

const verifyUserTypeReqBody = {
    validateCreateUserTypeRequestBody: validateCreateUserTypeRequestBody,
    validateUpdateUserTypeRequestBody: validateUpdateUserTypeRequestBody,
    validateUserTypeId: validateUserTypeId,
    validateUserTypeIds: validateUserTypeIds
};


module.exports = verifyUserTypeReqBody

