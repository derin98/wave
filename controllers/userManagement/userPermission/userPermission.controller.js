/**
 * This is the controller for the user resource
 */

const userReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/userManagement/user/user.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const userPermissionService = require('../../../services/internalServices/userManagement/userPermission/userPermission.services');

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
        const users = await userService.getAllUsers(req);
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

        const user = await userService.getUser(req.params.userId, selectFields, populateFields, req.businessUnit);

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

exports.updateUser = async (req, res) => {
    try {
        const userReqObj = userReqObjExtractor.updateUserObject(req);
        const user = await userService.updateUser(req.params.userId, userReqObj, req.businessUnit);
        const message = "User updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}