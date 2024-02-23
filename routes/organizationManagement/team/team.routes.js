const teamController = require('../../../controllers/organizationManagement/team/team.controller');
const { verifyTeamReqBody, verifyBusinessUnitAfterAuth, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/teams", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateCreateTeamRequestBody], teamController.createTeam);

    app.get("/api/v1/teams", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, ], teamController.getAllTeams);

    app.get("/api/v1/teams/:teamId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamId], teamController.getTeam);

    app.patch("/api/v1/teams/:teamId/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamId], teamController.enableTeam);

    app.patch("/api/v1/teams/:teamId/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamId], teamController.disableTeam);

    app.patch("/api/v1/teams/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamIds], teamController.enableTeams);

    app.patch("/api/v1/teams/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamIds], teamController.disableTeams);

    app.delete("/api/v1/teams/:teamId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamId], teamController.deleteTeam);

    app.delete("/api/v1/teams/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateTeamIds], teamController.deleteTeams);

    app.put("/api/v1/teams/:teamId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyTeamReqBody.validateUpdateTeamRequestBody, verifyTeamReqBody.validateTeamId], teamController.updateTeam);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const teamController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}