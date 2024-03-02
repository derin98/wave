const userTypeController = require('../../../controllers/organizationManagement/userType/userType.controller');
const { verifyUserTypeReqBody, verifyBusinessUnitAfterAuth, authJwt, verifyDepartmentReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments/:department/userTypes", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartment, verifyUserTypeReqBody.validateCreateUserTypeRequestBody], userTypeController.createUserType);

    app.get("/api/v1/userTypes",  [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit ], userTypeController.getAllUserTypes);

    app.get("/api/v1/userTypes/:userType", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserType], userTypeController.getUserType);

    app.patch("/api/v1/userTypes/:userType/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserType], userTypeController.enableUserType);

    app.patch("/api/v1/userTypes/:userType/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserType], userTypeController.disableUserType);

    app.patch("/api/v1/userTypes/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserTypes], userTypeController.enableUserTypes);

    app.patch("/api/v1/userTypes/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserTypes], userTypeController.disableUserTypes);

    app.delete("/api/v1/userTypes/:userType", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserType], userTypeController.deleteUserType);

    app.delete("/api/v1/userTypes/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserTypes], userTypeController.deleteUserTypes);

    app.put("/api/v1/userTypes/:userType", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserType, verifyUserTypeReqBody.validateUpdateUserTypeRequestBody], userTypeController.updateUserType);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const userTypeController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}