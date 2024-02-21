/**
 * This file will contain the middlewares for valdiating the permission request body
 */
const PermissionDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/permission/permission.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");
const BusinessUnitDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations");


validateCreatePermissionRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Permission name must be a non-empty string",
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
    const existingNamePermission = await PermissionDbOperations.checkExistingNameForPermissionGroup(req.body.name, req.params.id, req.businessUnitId);
    if (existingNamePermission) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Permission name already exists for the permission group",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Permission isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdatePermissionRequestBody = async (req, res, next) => {
    // Validate request
    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Permission name must be a non-empty string",
                400,
                null
            );
        }

        const existingNamePermission = await PermissionDbOperations.checkExistingNameForPermissionGroup(req.body.name, req.permissionGroupId, req.businessUnitId);
        if (existingNamePermission) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Permission name already exists for the permission group",
                400,
                null
            );
        }
        if (req.body.isEnabled !== undefined) {
            if (typeof req.body.isEnabled !== 'boolean') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Permission isEnabled should be a boolean",
                    400,
                    null
                );
            }
        }
    }
    next();
}

validatePermissionId = async (req, res, next) => {
    if (!req.params.id || typeof req.params.id !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Permission id must be a non-empty string",
            400,
            null
        );
    }
    let checkExistingPermission = await PermissionDbOperations.checkExistingPermissionId(req.params.id, req.businessUnitId);
    if (checkExistingPermission) {
        req.permissionGroupId = checkExistingPermission.permissionGroupId;
        next();
    } else {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Permission does not exist",
            400,
            null
        );
    }
}

validatePermissionIds = async (req, res, next) => {

    if (!req.body.ids || !Array.isArray(req.body.ids) || req.body.ids.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Permission ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.ids.length; i++) {
        if (typeof req.body.ids[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Permission ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }
    let invalidPermissionIds = await PermissionDbOperations.returnInvalidPermissionIds(req.body.ids, req.businessUnitId);
    if (invalidPermissionIds.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Permission ids",
            400,
            { invalidPermissionIds }
        );
    }
    next();
}

const verifyPermissionReqBody = {
    validateCreatePermissionRequestBody: validateCreatePermissionRequestBody,
    validateUpdatePermissionRequestBody: validateUpdatePermissionRequestBody,
    validatePermissionId: validatePermissionId,
    validatePermissionIds: validatePermissionIds
};


module.exports = verifyPermissionReqBody

