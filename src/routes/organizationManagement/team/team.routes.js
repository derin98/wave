const teamController = require('../../../controllers/organizationManagement/team/team.controller');
const { verifyTeamReqBody, verifyBusinessUnitAfterAuth, authJwt, verifyDepartmentReqBody, verifyUserReq} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments/:department/teams", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartment, verifyUserReq.validateUsers, verifyUserReq.validateUsersWithoutTeam, verifyTeamReqBody.validateCreateTeamRequestBody], teamController.createTeam);

    app.get("/api/v1/teams", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartmentsFromQuery], teamController.getAllTeams);

    app.get("/api/v1/teams/:team", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeam], teamController.getTeam);

    app.patch("/api/v1/teams/:team/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeam], teamController.enableTeam);

    app.patch("/api/v1/teams/:team/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeam], teamController.disableTeam);

    app.patch("/api/v1/teams/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeams], teamController.enableTeams);

    app.patch("/api/v1/teams/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeams], teamController.disableTeams);

    app.delete("/api/v1/teams/:team", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeamAndReturnObj], teamController.deleteTeam);

    app.put("/api/v1/teams/delete", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeamsFromBodyAndReturnObjs], teamController.deleteTeams);

    app.put("/api/v1/teams/:team", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyTeamReqBody.validateTeamAndReturnObj,
        verifyTeamReqBody.validateAppendAndRemoveUsersFromBody,
        verifyTeamReqBody.validateUpdateTeamRequestBody], teamController.updateTeam);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const teamController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}