/**
 * This is the controller for the user resource
 */

const userReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/userManagement/user/user.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const userManager = require('../../../managers/internalManagers/userManagement/user/user.managers');
const teamManager = require('../../../managers/internalManagers/organizationManagement/team/team.managers');

/**
 * Create a user
 *
 */

exports.createUser = async (req, res) => {
    try {
        const userReqObj = userReqObjExtractor.createUserObject(req);
        const user = await userManager.createUser(userReqObj);

        const message = "User created successfully";
        return apiResponseHandler.successResponse(res, message, user, 201);
    } catch (err) {
        console.log("Error while creating the user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

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
 * Enable a user
 *
 */

exports.enableUser = async (req, res) => {
    try {
        const user = await userManager.enableUser(req);
        console.log("user", user)
        const message = "User enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a user
 *
 */


exports.disableUser = async (req, res) => {
    try {
        const user = await userManager.disableUser(req.params.user, req.businessUnit);
        const message = "User disabled successfully";
        await teamManager.removeUsersFromTeams(req.params.users);
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable users
 *
 */


exports.enableUsers = async (req, res) => {
    try {
        await userManager.enableUsers(req);
        const message = "Users enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling users", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable users
 *
 */


exports.disableUsers = async (req, res) => {
    try {
        await userManager.disableUsers(req);
        const message = "Users disabled successfully";
        let vvv = await teamManager.removeUsersFromTeams(req.body.users);
        console.log("vvv", vvv)
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling users", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a user
 *
 */

exports.deleteUser = async (req, res) => {
    try {
        await userManager.deleteUser(req);
        const message = "User deleted successfully";
        await teamManager.removeUsersFromTeams(req.params.users);
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete users
 *
 */

exports.deleteUsers = async (req, res) => {
    try {
        await userManager.deleteUsers(req);
        const message = "Users deleted successfully";
        await teamManager.removeUsersFromTeams(req.body.users);
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting users", err.message);
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
        console.log("userReqObj", userReqObj)
        if (userReqObj.hasOwnProperty('team')) {
            if(userReqObj.team === null && req.userObj.team) {
                await teamManager.removeUsersFromTeam(req.userObj.team, [req.params.user], req.businessUnit);
            }
            else if(userReqObj.team !== null && req.userObj.team !== userReqObj.team) {
                console.log("userReqObj.team", userReqObj.team)
                await teamManager.appendUsersToTeam(userReqObj.team, [req.params.user], req.businessUnit);
                if (req.userObj.team) {
                    await teamManager.removeUsersFromTeam(req.userObj.team, [req.params.user], req.businessUnit);
                }
            }
        }
        const user = await userManager.updateUser(req, userReqObj);
        const message = "User updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

exports.getTotalAndEnabledUsersCount = async (req, res) => {
    try {
        const users = await userManager.getTotalAndEnabledUsers(req);
        const message = "Users fetched successfully";
        return apiResponseHandler.successResponse(res, message, users, 200);
    } catch (err) {
        console.log("Error while fetching users", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}