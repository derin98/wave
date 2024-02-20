const permissionController = require('../../../controllers/organizationManagement/permission/permission.controller');
const { verifyPermissionReqBody, verifyBusinessUnitAfterAuth, authJwt, verifyPermissionGroupReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/permissionGroups/:id/permissions", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupId, verifyPermissionReqBody.validateCreatePermissionRequestBody], permissionController.createPermission);

    app.get("/api/v1/permissions",  [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId ], permissionController.getAllPermissions);

    app.get("/api/v1/permissions/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionId], permissionController.getPermission);

    app.patch("/api/v1/permissions/:id/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionId], permissionController.enablePermission);

    app.patch("/api/v1/permissions/:id/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionId], permissionController.disablePermission);

    app.patch("/api/v1/permissions/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionIds], permissionController.enablePermissions);

    app.patch("/api/v1/permissions/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionIds], permissionController.disablePermissions);

    app.delete("/api/v1/permissions/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionId], permissionController.deletePermission);

    app.delete("/api/v1/permissions/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validatePermissionIds], permissionController.deletePermissions);

    app.put("/api/v1/permissions/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionReqBody.validateUpdatePermissionRequestBody, verifyPermissionReqBody.validatePermissionId], permissionController.updatePermission);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const permissionController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}