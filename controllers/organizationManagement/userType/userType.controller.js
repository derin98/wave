/**
 * This is the controller for the userType resource
 */

const userTypeReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/userType/userType.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const userTypeService = require('../../../managers/internalManagers/organizationManagement/userType/userType.managers');
/**
 * Create a userType
 *
 */

exports.createUserType = async (req, res) => {
    try {
        const userTypeReqObj = userTypeReqObjExtractor.createUserTypeObject(req);
        const userType = await userTypeService.createUserType(userTypeReqObj);
        const message = "UserType created successfully";
        return apiResponseHandler.successResponse(res, message, userType, 201);
    } catch (err) {
        console.log("Error while creating the userType", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Get all userTypes
 *
 */

exports.getAllUserTypes = async (req, res) => {
    try {
        const userTypes = await userTypeService.getAllUserTypes(req);
        const message = "UserTypes fetched successfully";
        return apiResponseHandler.successResponse(res, message, userTypes, 200);
    } catch (err) {
        console.log("Error while fetching userTypes", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a userType
 *
 */

exports.getUserType = async (req, res) => {
    try {
        const userType = await userTypeService.getUserType(req.params.userType);

        if (!userType) {
            return apiResponseHandler.errorResponse(res, "UserType not found", 404, null);
        }
        const message = "UserType fetched successfully";
        return apiResponseHandler.successResponse(res, message, userType, 200);
    } catch (err) {
        console.log("Error while fetching userType", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}

/**
 * Enable a userType
 *
 */

exports.enableUserType = async (req, res) => {
    try {
        const userType = await userTypeService.enableUserType(req.params.userType);
        const message = "UserType enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling userType", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a userType
 *
 */


exports.disableUserType = async (req, res) => {
    try {
        const userType = await userTypeService.disableUserType(req.params.userType);
        const message = "UserType disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling userType", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable userTypes
 *
 */


exports.enableUserTypes = async (req, res) => {
    try {
        await userTypeService.enableUserTypes(req.body.userTypes);
        const message = "UserTypes enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling userTypes", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable userTypes
 *
 */


exports.disableUserTypes = async (req, res) => {
    try {
        await userTypeService.disableUserTypes(req.body.userTypes);
        const message = "UserTypes disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling userTypes", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a userType
 *
 */

exports.deleteUserType = async (req, res) => {
    try {
        await userTypeService.deleteUserType(req.params.userType);
        const message = "UserType deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting userType", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete userTypes
 *
 */

exports.deleteUserTypes = async (req, res) => {
    try {
        await userTypeService.deleteUserTypes(req.body.userTypes);
        const message = "UserTypes deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting userTypes", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update a userType
 *
 */

exports.updateUserType = async (req, res) => {
    try {
        const userTypeReqObj = userTypeReqObjExtractor.updateUserTypeObject(req);
        const userType = await userTypeService.updateUserType(req.params.userType, userTypeReqObj);
        const message = "UserType updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating userType", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}