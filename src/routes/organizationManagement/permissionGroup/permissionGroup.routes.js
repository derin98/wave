const permissionGroupController = require('../../../controllers/organizationManagement/permissionGroup/permissionGroup.controller');
const { verifyPermissionGroupReqBody, verifyBusinessUnitAfterAuth, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/permissionGroups", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validateCreatePermissionGroupRequestBody], permissionGroupController.createPermissionGroup);

    app.get("/api/v1/permissionGroups", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, ], permissionGroupController.getAllPermissionGroups);

    app.get("/api/v1/permissionGroups/:permissionGroup", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroup], permissionGroupController.getPermissionGroup);

    app.patch("/api/v1/permissionGroups/:permissionGroup/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroup], permissionGroupController.enablePermissionGroup);

    app.patch("/api/v1/permissionGroups/:permissionGroup/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroup], permissionGroupController.disablePermissionGroup);

    app.patch("/api/v1/permissionGroups/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroups], permissionGroupController.enablePermissionGroups);

    app.patch("/api/v1/permissionGroups/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroups], permissionGroupController.disablePermissionGroups);

    app.delete("/api/v1/permissionGroups/:permissionGroup", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroup], permissionGroupController.deletePermissionGroup);

    app.delete("/api/v1/permissionGroups/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validatePermissionGroups], permissionGroupController.deletePermissionGroups);

    app.put("/api/v1/permissionGroups/:permissionGroup", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyPermissionGroupReqBody.validateUpdatePermissionGroupRequestBody, verifyPermissionGroupReqBody.validatePermissionGroup], permissionGroupController.updatePermissionGroup);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const permissionGroupController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}