const permissionGroupController = require('../../../controllers/organizationManagement/permissionGroup/permissionGroup.controller');
const { verifyPermissionGroupReqBody, verifyBusinessUnitAfterAuth, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/permissionGroups", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validateCreatePermissionGroupRequestBody], permissionGroupController.createPermissionGroup);

    app.get("/api/v1/permissionGroups", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, ], permissionGroupController.getAllPermissionGroups);

    app.get("/api/v1/permissionGroups/:permissionGroupId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupId], permissionGroupController.getPermissionGroup);

    app.patch("/api/v1/permissionGroups/:permissionGroupId/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupId], permissionGroupController.enablePermissionGroup);

    app.patch("/api/v1/permissionGroups/:permissionGroupId/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupId], permissionGroupController.disablePermissionGroup);

    app.patch("/api/v1/permissionGroups/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupIds], permissionGroupController.enablePermissionGroups);

    app.patch("/api/v1/permissionGroups/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupIds], permissionGroupController.disablePermissionGroups);

    app.delete("/api/v1/permissionGroups/:permissionGroupId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupId], permissionGroupController.deletePermissionGroup);

    app.delete("/api/v1/permissionGroups/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validatePermissionGroupIds], permissionGroupController.deletePermissionGroups);

    app.put("/api/v1/permissionGroups/:permissionGroupId", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyPermissionGroupReqBody.validateUpdatePermissionGroupRequestBody, verifyPermissionGroupReqBody.validatePermissionGroupId], permissionGroupController.updatePermissionGroup);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const permissionGroupController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}