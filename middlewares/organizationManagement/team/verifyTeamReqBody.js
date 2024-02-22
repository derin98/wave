/**
 * This file will contain the middlewares for valdiating the team request body
 */
const TeamDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/team/team.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");


validateCreateTeamRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Team name must be a non-empty string",
            400,
            null
        );
    }

    // Check if the provided name already exists in the database
    const existingNameTeam = await TeamDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnitId);
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

        const existingNameTeam = await TeamDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnitId);
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

validateTeamId = async (req, res, next) => {

    // Check if teamId is in req.params
    if (req.params.teamId && typeof req.params.teamId === 'string') {
        req.teamId = req.params.teamId;
    }
    // If not, check if teamId is in req.body
    else if (req.body.teamId && typeof req.body.teamId === 'string') {
        req.teamId = req.body.teamId;
    }
    // If departmentId is not in req.params or req.body, return an error response
    else {
        return apiResponseHandler.errorResponse(
            res,
            "Team id must be a non-empty string in req.params or req.body",
            400,
            null
        );
    }


    let checkExistingTeam = await TeamDbOperations.checkExistingTeamId(req.teamId, req.businessUnitId);
    if (checkExistingTeam) {
        next();
    } else {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Team does not exist",
            400,
            null
        );
    }
}

validateTeamIds = async (req, res, next) => {

    if (!req.body.teamIds || !Array.isArray(req.body.teamIds) || req.body.teamIds.length === 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Team ids must be a non-empty array of strings",
            400,
            null
        );
    }
    for (let i = 0; i < req.body.teamIds.length; i++) {
        if (typeof req.body.teamIds[i] !== 'string') {
            return apiResponseHandler.errorResponse(
                res,
                "Team ids must be a non-empty array of strings",
                400,
                null
            );
        }
    }

    let invalidTeamIds = await TeamDbOperations.returnInvalidTeamIds(req.body.teamIds, req.businessUnitId);
    if (invalidTeamIds.length > 0) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid Team ids",
            400,
            { invalidTeamIds }
        );
    }
    next();
}

const verifyTeamReqBody = {
    validateCreateTeamRequestBody: validateCreateTeamRequestBody,
    validateUpdateTeamRequestBody: validateUpdateTeamRequestBody,
    validateTeamId: validateTeamId,
    validateTeamIds: validateTeamIds
};


module.exports = verifyTeamReqBody

