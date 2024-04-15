/**
 * This is the controller for the user resource
 */

const userPermissionReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/userManagement//userPermission/userPermission.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const userPermissionManager = require('../../../managers/internalManagers/userManagement/userPermission/userPermission.managers');

/**
 * Create a user
 *
 */


/**
 * Get all users
 *
 */

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userManager.getAllUsers(req);
        const message = "Users fetched successfully";
        return apiResponseHandler.successResponse(res, message, users, 200);
    } catch (err) {
        console.log("Error while fetching users", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a user
 *
 */

exports.getUser = async (req, res) => {
    try {
        let populateFields = req.query.populateFields || undefined;
        let selectFields = req.query.selectFields || undefined;

        const user = await userManager.getUser(req.params.user, selectFields, populateFields, req.businessUnit);

        if (!user) {
            return apiResponseHandler.errorResponse(res, "User not found", 404, null);
        }
        const message = "User fetched successfully";
        return apiResponseHandler.successResponse(res, message, user, 200);
    } catch (err) {
        console.log("Error while fetching user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}






/**
 * Update a user
 *
 */

exports.updateUserPermission = async (req, res) => {
    try {
        const userPermissionReqObj = userPermissionReqObjExtractor.updateUserPermissionObject(req);
        const userPermission = await userPermissionManager.updateUserPermission(req.params.userPermission, userPermissionReqObj, req.businessUnit);
        const message = "User permission updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating user permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

exports.updateMultipleUserPermissions = async (req, res) => {

    try {
        const userPermissions = await userPermissionManager.updateUserPermissions(req);
        if (userPermissions.modifiedCount === req.body.userPermissions.length) {
            const message = "User permissions updated successfully";
            return apiResponseHandler.successResponse(res, message, null, 200);
        } else {
            return apiResponseHandler.errorResponse(res, "Some user permissions failed to update", 500, null);
        }
    } catch (err) {
        console.log("Error while updating user permission", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
};