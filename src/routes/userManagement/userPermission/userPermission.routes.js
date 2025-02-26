const userPermissionController = require('../../../controllers/userManagement/userPermission/userPermission.controller');
const { verifyUserReq, verifyBusinessUnitAfterAuth, authJwt,
    verifyDepartmentReqBody,
    verifyUserTypeReqBody,
    verifyDesignationReqBody,
    verifyTeamReqBody,
    verifyPermissionReqBody,
    verifyUserPermissionReqBody
} = require("../../../middlewares");
const verifyTimeStamp = require("../../../middlewares/common/verifyTimeStamp");

module.exports = function (app) {

    // app.post("/api/v1/users", [
    //     // authJwt.verifyToken,
    //     verifyBusinessUnitAfterAuth.verifyBusinessUnit,
    //     verifyDepartmentReqBody.validateDepartment, verifyUserTypeReqBody.validateUserType,
    //     verifyDesignationReqBody.validateDesignation, verifyTeamReqBody.validateTeam,
    //     verifyUserReq.validateCreateUserRequest
    // ], userController.createUser);

    // app.get("/api/v1/users", [
    //         authJwt.verifyToken,
    //         verifyBusinessUnitAfterAuth.verifyBusinessUnit,
    //         verifyDepartmentReqBody.validateDepartmentsFromQuery,
    //         verifyUserTypeReqBody.validateUserTypesFromQuery,
    //         verifyDesignationReqBody.validateDesignationsFromQuery,
    //         verifyTeamReqBody.validateTeamsFromQuery,
    //         verifyUserReq.validateReportsTosFromQuery,
    //         verifyTimeStamp.validateCreatedAtFromQueryForSearch,
    //         verifyTimeStamp.validateUpdatedAtFromQueryForSearch
    //     ],
    //     userController.getAllUsers);
    //
    // app.get("/api/v1/users/count", [
    //         authJwt.verifyToken,
    //         verifyBusinessUnitAfterAuth.verifyBusinessUnit,
    //     ],
    //     userController.getTotalAndEnabledUsersCount);
    //
    // app.get("/api/v1/users/:user", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUser], userController.getUser);
    //
    // app.put("/api/v1/users/:user/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUser, verifyUserReq.rejectUpdatingUserBySameUser], userController.enableUser);
    //
    // app.put("/api/v1/users/:user/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUser, verifyUserReq.rejectUpdatingUserBySameUser], userController.disableUser);
    //
    // app.put("/api/v1/users/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUsers, verifyUserReq.rejectUpdatingUsersBySameUser], userController.enableUsers);
    //
    // app.put("/api/v1/users/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUsers, verifyUserReq.rejectUpdatingUsersBySameUser], userController.disableUsers);
    //
    // app.delete("/api/v1/users/:user", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUser, verifyUserReq.rejectUpdatingUserBySameUser], userController.deleteUser);
    //
    // app.delete("/api/v1/users/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserReq.validateUsers, verifyUserReq.rejectUpdatingUsersBySameUser], userController.deleteUsers);

    // app.put("/api/v1/userPermissions/update", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit,
    //     verifyPermissionReqBody.validatePositivePermissions, verifyPermissionReqBody.validateNegativePermissions,
    // ], userPermissionController.updateUserPermissions);
    app.put("/api/v1/userPermissions/updateMultiple", [
        authJwt.verifyToken,
        verifyBusinessUnitAfterAuth.verifyBusinessUnit,
        verifyUserPermissionReqBody.checkUserPermissionsIsArray ,
        verifyUserPermissionReqBody.validateUserPermissionsArray ,
        verifyPermissionReqBody.validatePositivePermissionsArray ,
        verifyPermissionReqBody.validateNegativePermissionsArray,
    ], userPermissionController.updateMultipleUserPermissions);

    app.put("/api/v1/userPermissions/:userPermission", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserPermissionReqBody.validateUserPermission,
        verifyPermissionReqBody.validatePositivePermissions, verifyPermissionReqBody.validateNegativePermissions,
    ], userPermissionController.updateUserPermission);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const userController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}