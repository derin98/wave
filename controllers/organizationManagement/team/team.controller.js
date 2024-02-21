/**
 * This is the controller for the team resource
 */

const teamReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/team/team.reqObjExtractor');
const apiResponseHandler = require('../../../utils/responseHandlers/apiResponseHandler');
const teamService = require('../../../services/internalServices/organizationManagement/team/team.services');
/**
 * Create a team
 *
 */

exports.createTeam = async (req, res) => {
    try {
        const teamReqObj = teamReqObjExtractor.createTeamObject(req);
        const team = await teamService.createTeam(teamReqObj);
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
        const team = await teamService.getTeam(req.params.teamId, req.businessUnitId);

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
        const team = await teamService.enableTeam(req.params.teamId, req.businessUnitId);
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
        const team = await teamService.disableTeam(req.params.teamId, req.businessUnitId);
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
        await teamService.enableTeams(req.body.teamIds, req.businessUnitId, req.businessUnitId);
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
        await teamService.disableTeams(req.body.teamIds, req.businessUnitId);
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
        await teamService.deleteTeam(req.params.teamId, req.businessUnitId);
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
        await teamService.deleteTeams(req.body.teamIds, req.businessUnitId);
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
        const team = await teamService.updateTeam(req.params.teamId, teamReqObj, req.businessUnitId);
        const message = "Team updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating team", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}