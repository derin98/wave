/**
 * This file will contain the middlewares for valdiating the permissionGroup request body
 */
const PermissionGroupDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/permissionGroup/permissionGroup.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");


validateCreatePermissionGroupRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "PermissionGroup name must be a non-empty string",
            400,
            null
        );
    }

    if (!req.body.description || typeof req.body.description !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "PermissionGroup description must be a non-empty string",
            400,
            null
        );
    }

    // Check if the provided name already exists in the database
    const existingNamePermissionGroup = await PermissionGroupDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnitId);
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
    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit name must be a non-empty string",
                400,
                null
            );
        }

        const existingNamePermissionGroup = await PermissionGroupDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnitId);
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
    if (req.body.description){
        if (typeof req.body.description !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit description must be a non-empty string",
                400,
                null
            );
        }
    }
    next();
}

validatePermissionGroupId = async (req, res, next) => {
    if (!req.params.id || typeof req.params.id !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "PermissionGroup id must be a non-empty string",
            400,
            null
        );
    }

    let checkExistingPermissionGroup = await PermissionGroupDbOperations.checkExistingPermissionGroupId(req.params.id, req.businessUnitId);
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

validatePermissionGroupIds = async (req, res, next) => {

    if (!req.body.ids || !Array.isArray(req.body.ids) || req.body.ids.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "PermissionGroup ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.ids.length; i++) {
        if (typeof req.body.ids[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "PermissionGroup ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let invalidPermissionGroupIds = await PermissionGroupDbOperations.returnInvalidPermissionGroupIds(req.body.ids, req.businessUnitId);
    if (invalidPermissionGroupIds.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid PermissionGroup ids",
            400,
            { invalidPermissionGroupIds }
        );
    }
    next();
}

const verifyPermissionGroupReqBody = {
    validateCreatePermissionGroupRequestBody: validateCreatePermissionGroupRequestBody,
    validateUpdatePermissionGroupRequestBody: validateUpdatePermissionGroupRequestBody,
    validatePermissionGroupId: validatePermissionGroupId,
    validatePermissionGroupIds: validatePermissionGroupIds
};


module.exports = verifyPermissionGroupReqBody

