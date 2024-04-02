/**
 * This is the controller for the permissionGroup resource
 */

const permissionGroupReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/permissionGroup/permissionGroup.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const permissionGroupManager = require('../../../managers/internalManagers/organizationManagement/permissionGroup/permissionGroup.managers');
/**
 * Create a permissionGroup
 *
 */

exports.createPermissionGroup = async (req, res) => {
    try {
        const permissionGroupReqObj = permissionGroupReqObjExtractor.createPermissionGroupObject(req);
        const permissionGroup = await permissionGroupManager.createPermissionGroup(permissionGroupReqObj);
        const message = "PermissionGroup created successfully";
        return apiResponseHandler.successResponse(res, message, permissionGroup, 201);
    } catch (err) {
        console.log("Error while creating the permissionGroup", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Get all permissionGroups
 *
 */

exports.getAllPermissionGroups = async (req, res) => {
    try {
        const permissionGroups = await permissionGroupManager.getAllPermissionGroups(req);
        const message = "PermissionGroups fetched successfully";
        return apiResponseHandler.successResponse(res, message, permissionGroups, 200);
    } catch (err) {
        console.log("Error while fetching permissionGroups", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a permissionGroup
 *
 */

exports.getPermissionGroup = async (req, res) => {
    try {
        const permissionGroup = await permissionGroupManager.getPermissionGroup(req.params.permissionGroup, req.businessUnit);

        if (!permissionGroup) {
            return apiResponseHandler.errorResponse(res, "PermissionGroup not found", 404, null);
        }
        const message = "PermissionGroup fetched successfully";
        return apiResponseHandler.successResponse(res, message, permissionGroup, 200);
    } catch (err) {
        console.log("Error while fetching permissionGroup", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}

/**
 * Enable a permissionGroup
 *
 */

exports.enablePermissionGroup = async (req, res) => {
    try {
        const permissionGroup = await permissionGroupManager.enablePermissionGroup(req.params.permissionGroup, req.businessUnit);
        const message = "PermissionGroup enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling permissionGroup", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a permissionGroup
 *
 */


exports.disablePermissionGroup = async (req, res) => {
    try {
        const permissionGroup = await permissionGroupManager.disablePermissionGroup(req.params.permissionGroup, req.businessUnit);
        const message = "PermissionGroup disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling permissionGroup", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable permissionGroups
 *
 */


exports.enablePermissionGroups = async (req, res) => {
    try {
        await permissionGroupManager.enablePermissionGroups(req.body.permissionGroups, req.businessUnit, req.businessUnit);
        const message = "PermissionGroups enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling permissionGroups", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable permissionGroups
 *
 */


exports.disablePermissionGroups = async (req, res) => {
    try {
        await permissionGroupManager.disablePermissionGroups(req.body.permissionGroups, req.businessUnit);
        const message = "PermissionGroups disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling permissionGroups", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a permissionGroup
 *
 */

exports.deletePermissionGroup = async (req, res) => {
    try {
        await permissionGroupManager.deletePermissionGroup(req.params.permissionGroup, req.businessUnit);
        const message = "PermissionGroup deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting permissionGroup", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete permissionGroups
 *
 */

exports.deletePermissionGroups = async (req, res) => {
    try {
        await permissionGroupManager.deletePermissionGroups(req.body.permissionGroups, req.businessUnit);
        const message = "PermissionGroups deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting permissionGroups", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update a permissionGroup
 *
 */

exports.updatePermissionGroup = async (req, res) => {
    try {
        const permissionGroupReqObj = permissionGroupReqObjExtractor.updatePermissionGroupObject(req);
        const permissionGroup = await permissionGroupManager.updatePermissionGroup(req.params.permissionGroup, permissionGroupReqObj, req.businessUnit);
        const message = "PermissionGroup updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating permissionGroup", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}