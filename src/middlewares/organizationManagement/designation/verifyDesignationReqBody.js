/**
 * This file will contain the middlewares for valdiating the designation request body
 */
const DesignationDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/designation/designation.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");
const BusinessUnitDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations");
const UserTypeDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/userType/userType.dbOperations");


validateCreateDesignationRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Designation name must be a non-empty string",
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
    const existingNameDesignation = await DesignationDbOperations.checkExistingNameForUserType(req.body.name, req.params.userType, req.businessUnit);
    if (existingNameDesignation) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Designation name already exists for the user type",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Designation isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdateDesignationRequestBody = async (req, res, next) => {
    // Validate request
    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Designation name must be a non-empty string",
                400,
                null
            );
        }

        const existingNameDesignation = await DesignationDbOperations.checkExistingNameForUserType(req.body.name, req.userType, req.businessUnit);
        if (existingNameDesignation) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Designation name already exists for the user type",
                400,
                null
            );
        }
        if (req.body.isEnabled !== undefined) {
            if (typeof req.body.isEnabled !== 'boolean') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Designation isEnabled should be a boolean",
                    400,
                    null
                );
            }
        }
    }
    next();
}

validateDesignation = async (req, res, next) => {
    if(req.params.designation || req.body.designation){
        // Check if designation is in req.params
        if (req.params.designation && typeof req.params.designation === 'string') {
            req.designation = req.params.designation;
        }
        // If not, check if designation is in req.body
        else if (req.body.designation && typeof req.body.designation === 'string') {
            req.designation = req.body.designation;
        }
        // If userType is not in req.params or req.body, return an error response
        else {
            return apiResponseHandler.errorResponse(
                res,
                "Designation id must be a non-empty string in req.params or req.body",
                400,
                null
            );
        }

        let checkExistingDesignation = await DesignationDbOperations.checkExistingDesignation(req.designation, req.businessUnit, req.userType);
        if (checkExistingDesignation) {
            req.userType = checkExistingDesignation.userType;
            next();
        } else {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Designation does not exist",
                400,
                null
            );
        }
    }
    else {
        next();
    }
}

validateDesignations = async (req, res, next) => {

    if (!req.body.designations || !Array.isArray(req.body.designations) || req.body.designations.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Designation ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.designations.length; i++) {
        if (typeof req.body.designations[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Designation ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }
    let invalidDesignations = await DesignationDbOperations.returnInvalidDesignations(req.body.designations, req.businessUnit);
    if (invalidDesignations.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Designation ids",
            400,
            { invalidDesignations }
        );
    }
    next();
}
validateDesignationsFromQuery = async (req, res, next) => {

    if(req.query.designations){
        //convert the string to array

        let designations = req.query.designations.split(",");

        if (!designations || !Array.isArray(designations) || designations.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Designation ids must be a non-empty string with comma separated values",
                400,
                null
            );
        }

        let invalidDesignations = await DesignationDbOperations.returnInvalidDesignations(designations, req.businessUnit);
        if (invalidDesignations.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid Designation ids",
                400,
                { invalidDesignations }
            );
        }

        req.designations = designations;
    }
    next();
}

checkDesignationsUpdateIsArray = async (req, res, next) => {
    if(req.body.designations && Array.isArray(req.body.designations) && req.body.designations.length > 0) {
        next();
    }
    else {
        return apiResponseHandler.errorResponse(
            res,
            "Designations must be a non-empty array of objects",
            400,
            null
        );
    }
}


validateDesignationsUpdateArray = async (req, res, next) => {

    try {
        const designationIds = req.body.designations.map(designation => designation.id);
        for (const designation of req.body.designations) {
            if (!designation.id || typeof designation.id !== 'string') {
                return apiResponseHandler.errorResponse(
                    res,
                    "designationId must be a non-empty string in each permission object",
                    400,
                    null
                );
            }

            // const existingUserPermission = await DesignationDbOperations.checkExistingUserPermissionId(designation.id);
            // if (!existingUserPermission) {
            //     return apiResponseHandler.errorResponse(
            //         res,
            //         `Failed! Designation ${designation.id} does not exist`,
            //         400,
            //         null
            //     );
            // }
        }
        let invalidDesignations = await DesignationDbOperations.returnInvalidDesignations(designationIds, req.businessUnit);
        if (invalidDesignations.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid Designation ids",
                400,
                { invalidDesignations }
            );
        }
        next();
    } catch (error) {
        console.log("Error validating user permissions:", error);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
};


const verifyDesignationReqBody = {
    validateCreateDesignationRequestBody: validateCreateDesignationRequestBody,
    validateUpdateDesignationRequestBody: validateUpdateDesignationRequestBody,
    validateDesignation: validateDesignation,
    validateDesignations: validateDesignations,
    validateDesignationsFromQuery: validateDesignationsFromQuery,
    checkDesignationsUpdateIsArray: checkDesignationsUpdateIsArray,
    validateDesignationsUpdateArray: validateDesignationsUpdateArray
};


module.exports = verifyDesignationReqBody

