/**
 * This file will contain the middlewares for valdiating the organizationManagement request body
 */
const BusinessUnitDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");


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
validateBusinessUnitId = async (req, res, next) => {
    // Validate request
    if (!req.params.id || typeof req.params.id !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit id must be a non-empty string",
            400,
            null
        );
    }
    let checkExistingBusinessUnit = await BusinessUnitDbOperations.checkExistingBusinessUnit(req.params.id);
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

validateBusinessUnitIds = async (req, res, next) => {
    // Validate request
    if (!req.body.ids || !Array.isArray(req.body.ids) || req.body.ids.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit ids must be a non-empty array of strings",
            400,
            null
        );

    }
    for (let i = 0; i < req.body.ids.length; i++) {
        if (typeof req.body.ids[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }
    let invalidBusinessUnitIds = await BusinessUnitDbOperations.returnInvalidBusinessUnitIds(req.body.ids);
    if (invalidBusinessUnitIds.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! BusinessUnits do not exist",
            400,
            {invalidIds: invalidBusinessUnitIds}
        );
    }
    next();
}

const verifyBusinessUnitRequest = {
    validateCreateBusinessUnitRequestBody: validateCreateBusinessUnitRequestBody,
    validateBusinessUnitId: validateBusinessUnitId,
    validateBusinessUnitIds: validateBusinessUnitIds,
    validateUpdateBusinessUnitRequestBody: validateUpdateBusinessUnitRequestBody

};
module.exports = verifyBusinessUnitRequest

