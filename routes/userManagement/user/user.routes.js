const userController = require('../../../controllers/userManagement/user/user.controller');
const { verifyUserReq, verifyBusinessUnitAfterAuth, authJwt,
    verifyDepartmentReqBody,
    verifyUserTypeReqBody,
    verifyDesignationReqBody,
    verifyTeamReqBody
} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/users", [
        // authJwt.verifyToken,
        verifyBusinessUnitAfterAuth.verifyBusinessUnit,
        verifyDepartmentReqBody.validateDepartment, verifyUserTypeReqBody.validateUserType,
        verifyDesignationReqBody.validateDesignation, verifyTeamReqBody.validateTeam,
        verifyUserReq.validateCreateUserRequest
    ], userController.createUser);

    app.get("/api/v1/users", [
            authJwt.verifyToken,
            verifyBusinessUnitAfterAuth.verifyBusinessUnit,
            verifyDepartmentReqBody.validateDepartmentsFromQuery,
            verifyUserTypeReqBody.validateUserTypesFromQuery,
            verifyDesignationReqBody.validateDesignationsFromQuery,
            verifyTeamReqBody.validateTeamsFromQuery,
            verifyUserReq.validateReportsTosFromQuery,
        ],
        userController.getAllUsers);

    app.get("/api/v1/users/:userId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserId], userController.getUser);

    app.patch("/api/v1/users/:userId/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserId], userController.enableUser);

    app.patch("/api/v1/users/:userId/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserId], userController.disableUser);

    app.patch("/api/v1/users/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserIds], userController.enableUsers);

    app.patch("/api/v1/users/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserIds], userController.disableUsers);

    app.delete("/api/v1/users/:userId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserId], userController.deleteUser);

    app.delete("/api/v1/users/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUserIds], userController.deleteUsers);

    app.put("/api/v1/users/:userId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUpdateUserRequest, verifyUserReq.validateUserId], userController.updateUser);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const userController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}