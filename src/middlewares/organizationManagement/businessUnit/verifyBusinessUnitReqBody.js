/**
 * This file will contain the middlewares for valdiating the business unit request body
 */
const BusinessUnitDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");


validateCreateBusinessUnitRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit name must be a non-empty string",
            400,
            null
        );
    }

    if (!req.body.shortName || typeof req.body.shortName !== 'string' || req.body.shortName.length > 3) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit shortName must be a non-empty string with a maximum length of 3 characters",
            400,
            null
        );
    }
    req.body.shortName = req.body.shortName.toUpperCase()
    // Check if the provided name already exists in the database
    const existingNameBusinessUnit = await BusinessUnitDbOperations.checkExistingName(req.body.name);
    if (existingNameBusinessUnit) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! BusinessUnit name already exists",
            400,
            null
        );
    }
    // Check if the provided shortName already exists in the database
    const existingShortNameBusinessUnit = await BusinessUnitDbOperations.checkExistingShortName(req.body.shortName);
    if (existingShortNameBusinessUnit) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! BusinessUnit shortName already exists",
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
    next();
};

validateUpdateBusinessUnitRequestBody = async (req, res, next) => {
    // Validate request
    if (req.body.name ) {
    if (typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit name must be a non-empty string",
            400,
            null
        );
    }
        // Check if the provided name already exists in the database
        const existingNameBusinessUnit = await BusinessUnitDbOperations.checkExistingName(req.body.name);
        if (existingNameBusinessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! BusinessUnit name already exists",
                400,
                null
            );
        }
    }
    if (req.body.shortName) {
        if (typeof req.body.shortName !== 'string' || req.body.shortName.length > 3) {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit shortName must be a non-empty string with a maximum length of 3 characters",
                400,
                null
            );
        }
        req.body.shortName = req.body.shortName.toUpperCase()
        // Check if the provided shortName already exists in the database
        const existingShortNameBusinessUnit = await BusinessUnitDbOperations.checkExistingShortName(req.body.shortName);
        if (existingShortNameBusinessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! BusinessUnit shortName already exists",
                400,
                null
            );
        }
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
    next();
};
validateBusinessUnit = async (req, res, next) => {
    // Validate request
    if (!req.params.businessUnit || typeof req.params.businessUnit !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit id must be a non-empty string",
            400,
            null
        );
    }
    let checkExistingBusinessUnit = await BusinessUnitDbOperations.checkExistingBusinessUnit(req.params.businessUnit);
    if (checkExistingBusinessUnit) {
        next();
    } else {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! BusinessUnit does not exist",
            400,
            null
        );
    }
};

validateBusinessUnits = async (req, res, next) => {
    // Validate request
    if (!req.body.businessUnits || !Array.isArray(req.body.businessUnits) || req.body.businessUnits.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit ids must be a non-empty array of strings",
            400,
            null
        );

    }
    for (let i = 0; i < req.body.businessUnits.length; i++) {
        if (typeof req.body.businessUnits[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }
    let invalidBusinessUnits = await BusinessUnitDbOperations.returnInvalidBusinessUnits(req.body.businessUnits);
    if (invalidBusinessUnits.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! BusinessUnits do not exist",
            400,
            {invalidBusinessUnits}
        );
    }
    next();
}

const verifyBusinessUnitRequest = {
    validateCreateBusinessUnitRequestBody: validateCreateBusinessUnitRequestBody,
    validateBusinessUnit: validateBusinessUnit,
    validateBusinessUnits: validateBusinessUnits,
    validateUpdateBusinessUnitRequestBody: validateUpdateBusinessUnitRequestBody

};
module.exports = verifyBusinessUnitRequest

