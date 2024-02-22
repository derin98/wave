const userController = require('../../../controllers/userManagement/user/user.controller');
const { verifyUserReqBody, verifyBusinessUnitAfterAuth, authJwt,
    verifyDepartmentReqBody,
    verifyUserTypeReqBody,
    verifyDesignationReqBody,
    verifyTeamReqBody
} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/users", [
        // authJwt.verifyToken,
        verifyBusinessUnitAfterAuth.verifyBusinessUnitId,
        verifyDepartmentReqBody.validateDepartmentId, verifyUserTypeReqBody.validateUserTypeId,
        verifyDesignationReqBody.validateDesignationId, verifyTeamReqBody.validateTeamId,
        verifyUserReqBody.validateCreateUserRequestBody
    ], userController.createUser);

    app.get("/api/v1/users", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, ], userController.getAllUsers);

    app.get("/api/v1/users/:userId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserId], userController.getUser);

    app.patch("/api/v1/users/:userId/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserId], userController.enableUser);

    app.patch("/api/v1/users/:userId/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserId], userController.disableUser);

    app.patch("/api/v1/users/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserIds], userController.enableUsers);

    app.patch("/api/v1/users/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserIds], userController.disableUsers);

    app.delete("/api/v1/users/:userId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserId], userController.deleteUser);

    app.delete("/api/v1/users/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUserIds], userController.deleteUsers);

    app.put("/api/v1/users/:userId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserReqBody.validateUpdateUserRequestBody, verifyUserReqBody.validateUserId], userController.updateUser);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const userController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}