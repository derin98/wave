const permissionController = require('../../../controllers/organizationManagement/permission/permission.controller');
const { verifyPermissionReqBody, verifyBusinessUnitAfterAuth, authJwt, verifyPermissionGroupReqBody} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/permissionGroups/:permissionGroup/permissions", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroup, verifyPermissionReqBody.validateCreatePermissionRequestBody], permissionController.createPermission);

    app.get("/api/v1/permissions",  [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit ], permissionController.getAllPermissions);

    app.get("/api/v1/permissions/:permission", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermission], permissionController.getPermission);

    app.patch("/api/v1/permissions/:permission/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermission], permissionController.enablePermission);

    app.patch("/api/v1/permissions/:permission/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermission], permissionController.disablePermission);

    app.patch("/api/v1/permissions/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermissions], permissionController.enablePermissions);

    app.patch("/api/v1/permissions/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermissions], permissionController.disablePermissions);

    app.delete("/api/v1/permissions/:permission", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermission], permissionController.deletePermission);

    app.delete("/api/v1/permissions/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermissions], permissionController.deletePermissions);

    app.put("/api/v1/permissions/:permission", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionReqBody.validatePermission, verifyPermissionReqBody.validateUpdatePermissionRequestBody ], permissionController.updatePermission);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const permissionController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}