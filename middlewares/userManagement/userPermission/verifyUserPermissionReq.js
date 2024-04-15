/**
 * This file will contain the middlewares for valdiating the userPermission request body
 */
const UserPermissionDbOperations = require('../../../dbOperations/mongoDB/userManagement/userPermission/userPermission.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");


validateCreateUserPermissionRequestBody = async (req, res, next) => {
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
            "UserPermission name must be a non-empty string",
            400,
            null
        );
    }

    // Check if the provided name already exists in the database
    const existingNameUserPermission = await UserPermissionDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
    if (existingNameUserPermission) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! UserPermission name already exists for the business unit",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! UserPermission isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdateUserPermissionRequestBody = async (req, res, next) => {
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

        const existingNameUserPermission = await UserPermissionDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
        if (existingNameUserPermission) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! UserPermission name already exists for the business unit",
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

validateUserPermission = async (req, res, next) => {

    if(req.body.userPermission || req.params.userPermission || req.query.userPermission){// Check if userPermission is in req.params
        if (req.params.userPermission && typeof req.params.userPermission === 'string') {
            req.userPermission = req.params.userPermission;
        }
        else if (req.query.userPermission && typeof req.query.userPermission === 'string') {
            req.userPermission = req.query.userPermission;
        }
        // If not, check if userPermission is in req.body
        else if (req.body.userPermission && typeof req.body.userPermission === 'string') {
            req.userPermission = req.body.userPermission;
        }
        // If userPermission is not in req.params or req.body, return an error response
        else {
            return apiResponseHandler.errorResponse(
                res,
                "UserPermission id must be a non-empty string in req.params or req.body",
                400,
                null
            );
        }



        // Check if the userPermission with the given ID exists
        let checkExistingUserPermission = await UserPermissionDbOperations.checkExistingUserPermissionId(req.userPermission);

        if (checkExistingUserPermission) {
            next();
        } else {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! UserPermission does not exist",
                400,
                null
            );
        }
    }
    else {
        next();
    }
}

// validateUserPermissions = async (req, res, next) => {
//
//     if (!req.body.userPermissions || !Array.isArray(req.body.userPermissions) || req.body.userPermissions.length === 0) {
//         return apiResponseHandler.errorResponse(
//             res,
//             "UserPermission ids must be a non-empty array of strings",
//             400,
//             null
//         );
//     }
//     for (let i = 0; i < req.body.userPermissions.length; i++) {
//         if (typeof req.body.userPermissions[i] !== 'string') {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "UserPermission ids must be a non-empty array of strings",
//                 400,
//                 null
//             );
//         }
//     }
//
//     let invalidUserPermissions = await UserPermissionDbOperations.returnInvalidUserPermissions(req.body.userPermissions, req.businessUnit);
//     if (invalidUserPermissions.length > 0) {
//         return apiResponseHandler.errorResponse(
//             res,
//             "Failed! Invalid UserPermission ids",
//             400,
//             { invalidUserPermissions }
//         );
//     }
//     next();
// }

// validateUserPermissionsFromQuery = async (req, res, next) => {
//
//     if(req.query.userPermissions){
//         //convert the string to array
//
//         let userPermissions = req.query.userPermissions.split(",");
//
//         if (!userPermissions || !Array.isArray(userPermissions) || userPermissions.length === 0) {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "UserPermission ids must be a non-empty string with comma separated values",
//                 400,
//                 null
//             );
//         }
//
//         let invalidUserPermissions = await UserPermissionDbOperations.returnInvalidUserPermissions(userPermissions, req.businessUnit);
//         if (invalidUserPermissions.length > 0) {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Failed! Invalid UserPermission ids",
//                 400,
//                 { invalidUserPermissions }
//             );
//         }
//
//         req.userPermissions = userPermissions;
//     }
//     next();
// }

checkUserPermissionsIsArray = async (req, res, next) => {
    if(req.body.userPermissions && Array.isArray(req.body.userPermissions) && req.body.userPermissions.length > 0) {
        next();
    }
    else {
        return apiResponseHandler.errorResponse(
            res,
            "Permissions must be a non-empty array of objects",
            400,
            null
        );
    }
}
// Middleware function to validate each user permission object in the array
validateUserPermissionsArray = async (req, res, next) => {
    try {
        for (const userPermission of req.body.userPermissions) {
            if (!userPermission.id || typeof userPermission.id !== 'string') {
                return apiResponseHandler.errorResponse(
                    res,
                    "userPermissionId must be a non-empty string in each permission object",
                    400,
                    null
                );
            }

            const existingUserPermission = await UserPermissionDbOperations.checkExistingUserPermissionId(userPermission.id);
            if (!existingUserPermission) {
                return apiResponseHandler.errorResponse(
                    res,
                    `Failed! UserPermission ${userPermission.id} does not exist`,
                    400,
                    null
                );
            }
        }
        next();
    } catch (error) {
        console.log("Error validating user permissions:", error);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
};



const verifyUserPermissionReqBody = {
    validateCreateUserPermissionRequestBody: validateCreateUserPermissionRequestBody,
    validateUpdateUserPermissionRequestBody: validateUpdateUserPermissionRequestBody,
    validateUserPermission: validateUserPermission,
    // validateUserPermissions: validateUserPermissions,
    // validateUserPermissionsFromQuery: validateUserPermissionsFromQuery,
    checkUserPermissionsIsArray: checkUserPermissionsIsArray,
    validateUserPermissionsArray: validateUserPermissionsArray
};


module.exports = verifyUserPermissionReqBody

