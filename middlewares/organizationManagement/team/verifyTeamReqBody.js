/**
 * This file will contain the middlewares for valdiating the team request body
 */
const TeamDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/team/team.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");
const DesignationDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/designation/designation.dbOperations");


validateCreateTeamRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.department || typeof req.department !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Designation id must be a non-empty string",
            400,
            null
        );
    }

    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Team name must be a non-empty string",
            400,
            null
        );
    }

    // Check if the provided name already exists in the database
    const existingNameTeam = await TeamDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.department);
    if (existingNameTeam) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Team name already exists for the business unit",
            400,
            null
        );
    }

    if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Team isEnabled should be a boolean",
                400,
                null
            );
        }
    }
    next();
}

validateUpdateTeamRequestBody = async (req, res, next) => {
    // Validate request
    if (req.body.name){
        if (typeof req.body.name !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit name must be a non-empty string",
                400,
                null
            );
        }

        let department = req.teamsObj ? req.teamsObj.department ? req.teamsObj.department : req.department : ""
        const existingNameTeam = await TeamDbOperations.checkExistingNameForBusinessUnit(req.body.name, department);
        if (existingNameTeam) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Team name already exists for the business unit",
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

validateTeam = async (req, res, next) => {
    // Check if team is in req.params
    if(req.params.team || req.body.team){
        if (req.params.team && typeof req.params.team === 'string') {
            req.team = req.params.team;
        }
        // If not, check if team is in req.body
        else if (req.body.team && typeof req.body.team === 'string') {
            req.team = req.body.team;
        }
        // If department is not in req.params or req.body, return an error response
        else {
            return apiResponseHandler.errorResponse(
                res,
                "Team id must be a non-empty string in req.params or req.body",
                400,
                null
            );
        }
        console.log("req.team", req.team, req.department)

        let checkExistingTeam = await TeamDbOperations.checkExistingTeam(req.team, req.department);
        if (!checkExistingTeam) {
            return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Team does not exist",
                    400,
                    null
                );
        }
        else{
            next()
        }
    }
    else{
    next()
    }
}

validateTeamAndReturnObj = async (req, res, next) => {

    // Check if team is in req.params
    if(req.params.team || req.body.team){
        if (req.params.team && typeof req.params.team === 'string') {
            req.team = req.params.team;
        }
        // If not, check if team is in req.body
        else if (req.body.team && typeof req.body.team === 'string') {
            req.team = req.body.team;
        }
        // If department is not in req.params or req.body, return an error response
        else {
            return apiResponseHandler.errorResponse(
                res,
                "Team id must be a non-empty string in req.params or req.body",
                400,
                null
            );
        }
        console.log("req.team", req.team, req.department)
        let query = {_id: req.team}
        if(req.department) {
            query.department =req.department
        }
        let checkExistingTeam = await TeamDbOperations.getTeam(query, "users department");
        console.log("checkExistingTeam", checkExistingTeam)
        if (checkExistingTeam){
            req.teamObj = checkExistingTeam;
        }

        else if (!checkExistingTeam) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Team does not exist",
                400,
                null
            );
        }

    }
    next()
}

validateTeams = async (req, res, next) => {

    if (!req.body.teams || !Array.isArray(req.body.teams) || req.body.teams.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Team ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.teams.length; i++) {
        if (typeof req.body.teams[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Team ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let invalidTeams = await TeamDbOperations.returnInvalidTeams(req.body.teams, req.department);
    if (invalidTeams.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Team ids",
            400,
            { invalidTeams }
        );
    }
    next();
}

validateTeamsFromBodyAndReturnObjs = async (req, res, next) => {

    if (!req.body.teams || !Array.isArray(req.body.teams) || req.body.teams.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Team ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.teams.length; i++) {
        if (typeof req.body.teams[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Team ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let validAndInvalidTeams = await TeamDbOperations.returnValidAndInvalidTeams(req.body.teams, req.department);
    let invalidTeams = validAndInvalidTeams.invalidTeams;
    if (invalidTeams.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Team ids",
            400,
            { invalidTeams }
        );
    }
    req.teamsObjs = validAndInvalidTeams.validTeams;
    next();
}
validateTeamsFromQuery = async (req, res, next) => {

    if(req.query.teams){
        //convert the string to array

        let teams = req.query.teams.split(",");

        if (!teams || !Array.isArray(teams) || teams.length === 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Team ids must be a non-empty string with comma separated values",
                400,
                null
            );
        }

        let invalidTeams = await TeamDbOperations.returnInvalidTeams(teams, req.department);
        if (invalidTeams.length > 0) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Invalid Team ids",
                400,
                { invalidTeams }
            );
        }

        req.teams = teams;
    }
    next();
}

const verifyTeamReqBody = {
    validateCreateTeamRequestBody: validateCreateTeamRequestBody,
    validateUpdateTeamRequestBody: validateUpdateTeamRequestBody,
    validateTeam: validateTeam,
    validateTeams: validateTeams,
    validateTeamsFromQuery: validateTeamsFromQuery,
    validateTeamAndReturnObj: validateTeamAndReturnObj,
    validateTeamsFromBodyAndReturnObjs: validateTeamsFromBodyAndReturnObjs
};


module.exports = verifyTeamReqBody

