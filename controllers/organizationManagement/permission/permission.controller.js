/**
 * This is the controller for the permission resource
 */

const permissionReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/permission/permission.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const permissionManager = require('../../../managers/internalManagers/organizationManagement/permission/permission.managers');
/**
 * Create a permission
 *
 */

exports.createPermission = async (req, res) => {
    try {
        const permissionReqObj = permissionReqObjExtractor.createPermissionObject(req);
        const permission = await permissionManager.createPermission(permissionReqObj);
        const message = "Permission created successfully";
        return apiResponseHandler.successResponse(res, message, permission, 201);
    } catch (err) {
        console.log("Error while creating the permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Get all permissions
 *
 */

exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionManager.getAllPermissions(req);
        const message = "Permissions fetched successfully";
        return apiResponseHandler.successResponse(res, message, permissions, 200);
    } catch (err) {
        console.log("Error while fetching permissions", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a permission
 *
 */

exports.getPermission = async (req, res) => {
    try {
        let populateFields = req.query.populateFields || undefined;
        let selectFields = req.query.selectFields || undefined;

        const permission = await permissionManager.getPermission(req.params.permission, selectFields, populateFields, req.businessUnit);

        if (!permission) {
            return apiResponseHandler.errorResponse(res, "Permission not found", 404, null);
        }
        const message = "Permission fetched successfully";
        return apiResponseHandler.successResponse(res, message, permission, 200);
    } catch (err) {
        console.log("Error while fetching permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}

/**
 * Enable a permission
 *
 */

exports.enablePermission = async (req, res) => {
    try {
        const permission = await permissionManager.enablePermission(req.params.permission);
        const message = "Permission enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a permission
 *
 */


exports.disablePermission = async (req, res) => {
    try {
        const permission = await permissionManager.disablePermission(req.params.permission);
        const message = "Permission disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable permissions
 *
 */


exports.enablePermissions = async (req, res) => {
    try {
        await permissionManager.enablePermissions(req.body.permissions);
        const message = "Permissions enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling permissions", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable permissions
 *
 */


exports.disablePermissions = async (req, res) => {
    try {
        await permissionManager.disablePermissions(req.body.permissions);
        const message = "Permissions disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling permissions", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a permission
 *
 */

exports.deletePermission = async (req, res) => {
    try {
        await permissionManager.deletePermission(req.params.permission);
        const message = "Permission deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete permissions
 *
 */

exports.deletePermissions = async (req, res) => {
    try {
        await permissionManager.deletePermissions(req.body.permissions);
        const message = "Permissions deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting permissions", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update a permission
 *
 */

exports.updatePermission = async (req, res) => {
    try {
        const permissionReqObj = permissionReqObjExtractor.updatePermissionObject(req);
        const permission = await permissionManager.updatePermission(req.params.permission, permissionReqObj);
        const message = "Permission updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}