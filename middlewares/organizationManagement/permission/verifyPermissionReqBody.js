/**
 * This file will contain the middlewares for valdiating the permission request body
 */
const PermissionDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/permission/permission.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");
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

    if (!req.businessUnit) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit Id must be a non-empty string",
            400,
            null
        );
    }
    // Check if the provided name already exists in the database
    const existingNamePermission = await PermissionDbOperations.checkExistingNameForPermissionGroup(req.body.name, req.params.permissionGroup, req.businessUnit);
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

        const existingNamePermission = await PermissionDbOperations.checkExistingNameForPermissionGroup(req.body.name, req.permissionGroup, req.businessUnit);
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

validatePermission = async (req, res, next) => {
    // Check if permission is in req.params
    if (req.params.permission && typeof req.params.permission === 'string') {
        req.permission = req.params.permission;
    }
    // If not, check if permission is in req.body
    else if (req.body.permission && typeof req.body.permission === 'string') {
        req.permission = req.body.permission;
    }
    // If permission is not in req.params or req.body, return an error response
    else {
        return apiResponseHandler.errorResponse(
            res,
            "Permission id must be a non-empty string in req.params or req.body",
            400,
            null
        );
    }

    let checkExistingPermission = await PermissionDbOperations.checkExistingPermission(req.params.permission, req.businessUnit, req.permissionGroup);
    if (checkExistingPermission) {
        req.permissionGroup = checkExistingPermission.permissionGroup;
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


validatePermissions = async (req, res, next) => {

    if(req.body.permissions){
        if (!req.body.permissions || !Array.isArray(req.body.permissions) || req.body.permissions.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Permission ids must be a non-empty array of strings",
                400,
                null
            );
        }
        for (let i = 0; i < req.body.permissions.length; i++) {
            if (typeof req.body.permissions[i] !== 'string') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Permission ids must be a non-empty array of strings",
                    400,
                    null
                );
            }
        }
        let invalidPermissions = await PermissionDbOperations.returnInvalidPermissions(req.body.permissions, req.businessUnit);
        if (invalidPermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid Permission ids",
                400,
                {invalidPermissions}
            );
        }
    }
    next();
}

const verifyPermissionReqBody = {
    validateCreatePermissionRequestBody: validateCreatePermissionRequestBody,
    validateUpdatePermissionRequestBody: validateUpdatePermissionRequestBody,
    validatePermission: validatePermission,
    validatePermissions: validatePermissions
};


module.exports = verifyPermissionReqBody

