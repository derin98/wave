/**
 * This is the controller for the team resource
 */

const teamReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/team/team.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const teamService = require('../../../managers/internalManagers/organizationManagement/team/team.managers');
const userService = require('../../../managers/internalManagers/userManagement/user/user.managers');
/**
 * Create a team
 *
 */

exports.createTeam = async (req, res) => {
    try {
        const teamReqObj = teamReqObjExtractor.createTeamObject(req);
        const team = await teamService.createTeam(teamReqObj);
        await userService.updateUsers(req, {team:team.id});
        const message = "Team created successfully";
        return apiResponseHandler.successResponse(res, message, team, 201);
    } catch (err) {
        console.log("Error while creating the team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Get all teams
 *
 */

exports.getAllTeams = async (req, res) => {
    try {
        const teams = await teamService.getAllTeams(req);
        const message = "Teams fetched successfully";
        return apiResponseHandler.successResponse(res, message, teams, 200);
    } catch (err) {
        console.log("Error while fetching teams", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a team
 *
 */

exports.getTeam = async (req, res) => {
    try {
        let populateFields = req.query.populateFields || undefined;
        let selectFields = req.query.selectFields || undefined;
        const team = await teamService.getTeam(req.params.team, selectFields, populateFields, req.businessUnit);
        if (!team) {
            return apiResponseHandler.errorResponse(res, "Team not found", 404, null);
        }
        const message = "Team fetched successfully";
        return apiResponseHandler.successResponse(res, message, team, 200);
    } catch (err) {
        console.log("Error while fetching team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}

/**
 * Enable a team
 *
 */

exports.enableTeam = async (req, res) => {
    try {
        const team = await teamService.enableTeam(req);
        const message = "Team enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a team
 *
 */


exports.disableTeam = async (req, res) => {
    try {
        const team = await teamService.disableTeam(req);
        const message = "Team disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable teams
 *
 */


exports.enableTeams = async (req, res) => {
    try {
        await teamService.enableTeams(req);
        const message = "Teams enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling teams", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable teams
 *
 */


exports.disableTeams = async (req, res) => {
    try {
        await teamService.disableTeams(req);
        const message = "Teams disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling teams", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a team
 *
 */

exports.deleteTeam = async (req, res) => {
    try {
        await teamService.deleteTeam(req);
        await userService.removeTeamFromUsers(req.teamObj.users, req.params.team);
        const message = "Team deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete teams
 *
 */

exports.deleteTeams = async (req, res) => {
    try {
        await teamService.deleteTeams(req);
        console.log("req.teamsObjs", req.teamsObjs)
        const removeTeamsFromUsers = await teamService.returnUsersFromTeams(req.teamsObjs);
        const reqObj = {
            body: {
                users: removeTeamsFromUsers
            }
        }
        await userService.updateUsers(reqObj, {team:null});
        const message = "Teams deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting teams", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update a team
 *
 */

exports.updateTeam = async (req, res) => {
    try {
        const teamReqObj = teamReqObjExtractor.updateTeamObject(req);
        const team = await teamService.updateTeam(req, teamReqObj);
        if(req.body.appendUsers){
            const reqObj = {
                body: {
                    users: req.body.appendUsers
                }
            }
            await userService.updateUsers(reqObj, {team:req.params.team});
            await teamService.appendUsersToTeam(req.params.team, req.body.appendUsers);
        }
        if(req.body.removeUsers){
            const reqObj = {
                body: {
                    users: req.body.removeUsers
                }
            }
            await userService.updateUsers(reqObj, {team:null});
            await teamService.removeUsersFromTeam(req.params.team, req.body.removeUsers);
        }
        const message = "Team updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}