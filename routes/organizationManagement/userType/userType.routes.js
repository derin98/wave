const userTypeController = require('../../../controllers/organizationManagement/userType/userType.controller');
const { verifyUserTypeReqBody, verifyBusinessUnitAfterAuth, authJwt, verifyDepartmentReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments/:id/userTypes", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentId, verifyUserTypeReqBody.validateCreateUserTypeRequestBody], userTypeController.createUserType);

    app.get("/api/v1/userTypes",  [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId ], userTypeController.getAllUserTypes);

    app.get("/api/v1/userTypes/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeId], userTypeController.getUserType);

    app.patch("/api/v1/userTypes/:id/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeId], userTypeController.enableUserType);

    app.patch("/api/v1/userTypes/:id/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeId], userTypeController.disableUserType);

    app.patch("/api/v1/userTypes/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeIds], userTypeController.enableUserTypes);

    app.patch("/api/v1/userTypes/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeIds], userTypeController.disableUserTypes);

    app.delete("/api/v1/userTypes/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeId], userTypeController.deleteUserType);

    app.delete("/api/v1/userTypes/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeIds], userTypeController.deleteUserTypes);

    app.put("/api/v1/userTypes/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeId, verifyUserTypeReqBody.validateUpdateUserTypeRequestBody], userTypeController.updateUserType);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const userTypeController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}