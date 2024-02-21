const designationController = require('../../../controllers/organizationManagement/designation/designation.controller');
const { verifyDesignationReqBody, verifyBusinessUnitAfterAuth, verifyPermissionReqBody,  authJwt, verifyUserTypeReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/userTypes/:userTypeId/designations", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyUserTypeReqBody.validateUserTypeId, verifyPermissionReqBody.validatePermissionIds, verifyDesignationReqBody.validateCreateDesignationRequestBody], designationController.createDesignation);

    app.get("/api/v1/designations",  [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId ], designationController.getAllDesignations);

    app.get("/api/v1/designations/:designationId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationId], designationController.getDesignation);

    app.patch("/api/v1/designations/:designationId/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationId], designationController.enableDesignation);

    app.patch("/api/v1/designations/:designationId/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationId], designationController.disableDesignation);

    app.patch("/api/v1/designations/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationIds], designationController.enableDesignations);

    app.patch("/api/v1/designations/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationIds], designationController.disableDesignations);

    app.delete("/api/v1/designations/:designationId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationId], designationController.deleteDesignation);

    app.delete("/api/v1/designations/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationIds], designationController.deleteDesignations);

    app.put("/api/v1/designations/:designationId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDesignationReqBody.validateDesignationId, verifyPermissionReqBody.validatePermissionIds, verifyDesignationReqBody.validateUpdateDesignationRequestBody], designationController.updateDesignation);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const designationController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}