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
    if (req.body.permissions) {
        if (!req.body.permissions || !Array.isArray(req.body.permissions) || req.body.permissions.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Permission ids must be a non-empty array of strings",
                400,
                null
            );
        }

        const uniquePermissions = new Set();
        const duplicatePermissions = [];

        for (let i = 0; i < req.body.permissions.length; i++) {
            const permissionId = req.body.permissions[i];

            if (typeof permissionId !== 'string') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Permission ids must be a non-empty array of strings",
                    400,
                    null
                );
            }

            // Check for duplicate permission IDs
            if (uniquePermissions.has(permissionId)) {
                duplicatePermissions.push(permissionId);
            } else {
                uniquePermissions.add(permissionId);
            }
        }

        if (duplicatePermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Duplicate permission ids are not allowed",
                400,
                { duplicatePermissions }
            );
        }

        let invalidPermissions = await PermissionDbOperations.returnInvalidPermissions(Array.from(uniquePermissions), req.businessUnit);

        if (invalidPermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid Permission ids",
                400,
                { invalidPermissions }
            );
        }
    }

    next();
}

validateMultiplePermissionsForDesignationsUpdateArray = async (req, res, next) => {

    if (req.body.designations) {
        const pemissions = req.body.designations.map(designation => designation.permissions);

        // keep only distinct permissions from pemissions by using set and keep it in an array
        if (pemissions.length > 0) {
            const uniquePermissions = [...new Set(pemissions.flat())];

            let invalidPermissions = await PermissionDbOperations.returnInvalidPermissions(Array.from(uniquePermissions), req.businessUnit);

            if (invalidPermissions.length > 0) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Invalid Permission ids",
                    400,
                    { invalidPermissions }
                );
            }
        }
    }
    next();
}

validatePositivePermissions = async (req, res, next) => {
    if (req.body.positivePermissions) {
        if (!req.body.positivePermissions || !Array.isArray(req.body.positivePermissions) || req.body.positivePermissions.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Positive Permission ids must be a non-empty array of strings",
                400,
                null
            );
        }

        const uniquePositivePermissions = new Set();
        const duplicatePositivePermissions = [];

        for (let i = 0; i < req.body.positivePermissions.length; i++) {
            const positivePermissionId = req.body.positivePermissions[i];

            if (typeof positivePermissionId !== 'string') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Positive Permission ids must be a non-empty array of strings",
                    400,
                    null
                );
            }

            // Check for duplicate permission IDs
            if (uniquePositivePermissions.has(positivePermissionId)) {
                duplicatePositivePermissions.push(positivePermissionId);
            } else {
                uniquePositivePermissions.add(positivePermissionId);
            }
        }

        if (duplicatePositivePermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Duplicate positive permission ids are not allowed",
                400,
                { duplicatePositivePermissions }
            );
        }

        let invalidPositivePermissions = await PermissionDbOperations.returnInvalidPermissions(Array.from(uniquePositivePermissions), req.businessUnit);

        if (invalidPositivePermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid positive Permission ids",
                400,
                { invalidPositivePermissions }
            );
        }
    }

    next();
}

validateNegativePermissions = async (req, res, next) => {
    if (req.body.negativePermissions) {
        if (!req.body.negativePermissions || !Array.isArray(req.body.negativePermissions) || req.body.negativePermissions.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Negative Permission ids must be a non-empty array of strings",
                400,
                null
            );
        }

        const uniqueNegativePermissions = new Set();
        const duplicateNegativePermissions = [];

        for (let i = 0; i < req.body.negativePermissions.length; i++) {
            const negativePermissionId = req.body.negativePermissions[i];

            if (typeof negativePermissionId !== 'string') {
                return apiResponseHandler.errorResponse(
                    res,
                    "Negative Permission ids must be a non-empty array of strings",
                    400,
                    null
                );
            }

            // Check for duplicate permission IDs
            if (uniqueNegativePermissions.has(negativePermissionId)) {
                duplicateNegativePermissions.push(negativePermissionId);
            } else {
                uniqueNegativePermissions.add(negativePermissionId);
            }
        }

        if (duplicateNegativePermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Duplicate negative permission ids are not allowed",
                400,
                { duplicateNegativePermissions }
            );
        }

        let invalidNegativePermissions = await PermissionDbOperations.returnInvalidPermissions(Array.from(uniqueNegativePermissions), req.businessUnit);

        if (invalidNegativePermissions.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid negative Permission ids",
                400,
                { invalidNegativePermissions }
            );
        }
    }

    next();
}


validatePositivePermissionsArray = (req, res, next) => {
    try {
        for (const permission of req.body.userPermissions) {
            if (permission.positivePermissions && (!Array.isArray(permission.positivePermissions) || permission.positivePermissions.length === 0)) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Positive Permissions must be a non-empty array of strings in each permission object",
                    400,
                    null
                );
            }

            if (permission.positivePermissions) {
                for (const positivePermissionId of permission.positivePermissions) {
                    if (typeof positivePermissionId !== 'string') {
                        return apiResponseHandler.errorResponse(
                            res,
                            "Positive Permission ids must be a non-empty array of strings in each permission object",
                            400,
                            null
                        );
                    }
                }
            }
        }
        next();
    } catch (error) {
        console.log("Error validating positive permissions:", error);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
};

validateNegativePermissionsArray = (req, res, next) => {
    try {
        for (const permission of req.body.userPermissions) {
            if (permission.negativePermissions && (!Array.isArray(permission.negativePermissions) || permission.negativePermissions.length === 0)) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Negative Permissions must be a non-empty array of strings in each permission object",
                    400,
                    null
                );
            }

            if (permission.negativePermissions) {
                for (const negativePermissionId of permission.negativePermissions) {
                    if (typeof negativePermissionId !== 'string') {
                        return apiResponseHandler.errorResponse(
                            res,
                            "Negative Permission ids must be a non-empty array of strings in each permission object",
                            400,
                            null
                        );
                    }
                }
            }
        }
        next();
    } catch (error) {
        console.log("Error validating negative permissions:", error);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
};

const verifyPermissionReqBody = {
    validateCreatePermissionRequestBody: validateCreatePermissionRequestBody,
    validateUpdatePermissionRequestBody: validateUpdatePermissionRequestBody,
    validatePermission: validatePermission,
    validatePermissions: validatePermissions,
    validatePositivePermissions: validatePositivePermissions,
    validateNegativePermissions: validateNegativePermissions,
    validatePositivePermissionsArray: validatePositivePermissionsArray,
    validateNegativePermissionsArray: validateNegativePermissionsArray,
    validateMultiplePermissionsForDesignationsUpdateArray: validateMultiplePermissionsForDesignationsUpdateArray
};


module.exports = verifyPermissionReqBody

