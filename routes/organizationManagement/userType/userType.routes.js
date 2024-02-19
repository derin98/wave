const userTypeController = require('../../../controllers/organizationManagement/userType/userType.controller');
const { verifyUserTypeReqBody, authJwt, verifyDepartmentReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments/:id/userTypes", [  verifyDepartmentReqBody.validateDepartmentId, verifyUserTypeReqBody.validateCreateUserTypeRequestBody], userTypeController.createUserType);

    app.get("/api/v1/userTypes",  userTypeController.getAllUserTypes);

    app.get("/api/v1/userTypes/:id", [ verifyUserTypeReqBody.validateUserTypeId], userTypeController.getUserType);

    app.patch("/api/v1/userTypes/:id/enable", [ verifyUserTypeReqBody.validateUserTypeId], userTypeController.enableUserType);

    app.patch("/api/v1/userTypes/:id/disable", [ verifyUserTypeReqBody.validateUserTypeId], userTypeController.disableUserType);

    app.patch("/api/v1/userTypes/enable", [ verifyUserTypeReqBody.validateUserTypeIds], userTypeController.enableUserTypes);

    app.patch("/api/v1/userTypes/disable", [ verifyUserTypeReqBody.validateUserTypeIds], userTypeController.disableUserTypes);

    app.delete("/api/v1/userTypes/:id", [ verifyUserTypeReqBody.validateUserTypeId], userTypeController.deleteUserType);

    app.delete("/api/v1/userTypes/", [ verifyUserTypeReqBody.validateUserTypeIds], userTypeController.deleteUserTypes);

    app.put("/api/v1/userTypes/:id", [ verifyUserTypeReqBody.validateUpdateUserTypeRequestBody, verifyUserTypeReqBody.validateUserTypeId], userTypeController.updateUserType);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const userTypeController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}