const designationController = require('../../../controllers/organizationManagement/designation/designation.controller');
const { verifyDesignationReqBody, verifyBusinessUnitAfterAuth, verifyPermissionReqBody,  authJwt, verifyUserTypeReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/userTypes/:userType/designations", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserType, verifyPermissionReqBody.validatePermissions, verifyDesignationReqBody.validateCreateDesignationRequestBody], designationController.createDesignation);

    app.get("/api/v1/designations",  [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyUserTypeReqBody.validateUserTypesFromQuery, verifyUserTypeReqBody.validateUserType ], designationController.getAllDesignations);

    app.get("/api/v1/designations/:designation", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignation], designationController.getDesignation);

    app.patch("/api/v1/designations/:designation/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignation], designationController.enableDesignation);

    app.patch("/api/v1/designations/:designation/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignation], designationController.disableDesignation);

    app.patch("/api/v1/designations/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignations], designationController.enableDesignations);

    app.patch("/api/v1/designations/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignations], designationController.disableDesignations);

    app.delete("/api/v1/designations/:designation", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignation], designationController.deleteDesignation);

    app.delete("/api/v1/designations/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignations], designationController.deleteDesignations);

    app.put("/api/v1/designations/update", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignation, verifyPermissionReqBody.validatePermissions, verifyDesignationReqBody.validateUpdateDesignationRequestBody], designationController.updateDesignation);

    app.put("/api/v1/designations/:designation", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDesignationReqBody.validateDesignation, verifyPermissionReqBody.validatePermissions, verifyDesignationReqBody.validateUpdateDesignationRequestBody], designationController.updateDesignation);

//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const designationController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}