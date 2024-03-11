/**
 * This file will contain the middlewares for valdiating the userType request body
 */
const UserTypeDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/userType/userType.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");
const BusinessUnitDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations");
const DepartmentDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/department/department.dbOperations");

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

    if (!req.businessUnit) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit Id must be a non-empty string",
            400,
            null
        );
    }
    // Check if the provided name already exists in the database
    const existingNameUserType = await UserTypeDbOperations.checkExistingNameForDepartment(req.body.name, req.params.department, req.businessUnit);
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

        const existingNameUserType = await UserTypeDbOperations.checkExistingNameForDepartment(req.body.name, req.department, req.businessUnit);
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

validateUserType = async (req, res, next) => {

    if (req.body.userType || req.params.userType){// Check if userType is in req.params
        if (req.params.userType && typeof req.params.userType === 'string') {
            req.userType = req.params.userType;
        }
        // If not, check if userType is in req.body
        else if (req.body.userType && typeof req.body.userType === 'string') {
            req.userType = req.body.userType;
        }
        // If userType is not in req.params or req.body, return an error response
        else {
            return apiResponseHandler.errorResponse(
                res,
                "UserType id must be a non-empty string in req.params or req.body",
                400,
                null
            );
        }

        // Check if the department with the given ID exists
        let checkExistingUserType = await UserTypeDbOperations.checkExistingUserType(req.userType, req.businessUnit, req.department);

        if (checkExistingUserType) {
            req.department = checkExistingUserType.department;
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
    else {
        next();
    }
}

validateUserTypes = async (req, res, next) => {

    if (!req.body.userTypes || !Array.isArray(req.body.userTypes) || req.body.userTypes.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "UserType ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.userTypes.length; i++) {
        if (typeof req.body.userTypes[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "UserType ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }
    let invalidUserTypes = await UserTypeDbOperations.returnInvalidUserTypes(req.body.userTypes, req.businessUnit);
    if (invalidUserTypes.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid UserType ids",
            400,
            { invalidUserTypes }
        );
    }
    next();
}

validateUserTypesFromQuery = async (req, res, next) => {

    if(req.query.userTypes){
        //convert the string to array

        let userTypes = req.query.userTypes.split(",");

        if (!userTypes || !Array.isArray(userTypes) || userTypes.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "UserType ids must be a non-empty string with comma separated values",
                400,
                null
            );
        }

        let invalidUserTypes = await UserTypeDbOperations.returnInvalidUserTypes(userTypes, req.businessUnit);
        if (invalidUserTypes.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid UserType ids",
                400,
                { invalidUserTypes }
            );
        }

        req.userTypes = userTypes;
    }
    next();
}

const verifyUserTypeReqBody = {
    validateCreateUserTypeRequestBody: validateCreateUserTypeRequestBody,
    validateUpdateUserTypeRequestBody: validateUpdateUserTypeRequestBody,
    validateUserType: validateUserType,
    validateUserTypes: validateUserTypes,
    validateUserTypesFromQuery: validateUserTypesFromQuery
};


module.exports = verifyUserTypeReqBody

