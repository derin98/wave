/**
 * This file will contain the middlewares for valdiating the permissionGroup request body
 */
const PermissionGroupDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/permissionGroup/permissionGroup.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");


validateCreatePermissionGroupRequestBody = async (req, res, next) => {
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
            "PermissionGroup name must be a non-empty string",
            400,
            null
        );
    }


    // Check if the provided name already exists in the database
    const existingNamePermissionGroup = await PermissionGroupDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
    if (existingNamePermissionGroup) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! PermissionGroup name already exists for the business unit",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! PermissionGroup isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdatePermissionGroupRequestBody = async (req, res, next) => {
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

        const existingNamePermissionGroup = await PermissionGroupDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
        if (existingNamePermissionGroup) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! PermissionGroup name already exists for the business unit",
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

validatePermissionGroup = async (req, res, next) => {

    if(req.params.permissionGroup || req.query.permissionGroup ) {
        if (!req.params.permissionGroup || typeof req.params.permissionGroup !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "PermissionGroup id must be a non-empty string",
                400,
                null
            );
        }

        if (!req.query.permissionGroup || typeof req.query.permissionGroup !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "PermissionGroup id must be a non-empty string",
                400,
                null
            );
        }

        let checkExistingPermissionGroup = await PermissionGroupDbOperations.checkExistingPermissionGroup(req.params.permissionGroup, req.businessUnit);
        if (checkExistingPermissionGroup) {
            next();
        } else {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! PermissionGroup does not exist",
                400,
                null
            );
        }
    }
    else {
        next();
    }
}

validatePermissionGroups = async (req, res, next) => {

    if (!req.body.permissionGroups || !Array.isArray(req.body.permissionGroups) || req.body.permissionGroups.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "PermissionGroup ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.permissionGroups.length; i++) {
        if (typeof req.body.permissionGroups[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "PermissionGroup ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let invalidPermissionGroups = await PermissionGroupDbOperations.returnInvalidPermissionGroups(req.body.permissionGroups, req.businessUnit);
    if (invalidPermissionGroups.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid PermissionGroup ids",
            400,
            { invalidPermissionGroups }
        );
    }
    next();
}

const verifyPermissionGroupReqBody = {
    validateCreatePermissionGroupRequestBody: validateCreatePermissionGroupRequestBody,
    validateUpdatePermissionGroupRequestBody: validateUpdatePermissionGroupRequestBody,
    validatePermissionGroup: validatePermissionGroup,
    validatePermissionGroups: validatePermissionGroups
};


module.exports = verifyPermissionGroupReqBody

