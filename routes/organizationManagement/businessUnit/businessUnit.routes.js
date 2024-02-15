const businessUnitController = require('../../../controllers/organizationManagement/businessUnit/businessUnit.controller');
const { verifyBusinessUnitRequest, verifyMongoId, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/businessUnits", [ verifyBusinessUnitRequest.validateCreateBusinessUnitRequestBody], businessUnitController.createBusinessUnit);

    app.get("/api/v1/businessUnits",  businessUnitController.getAllBusinessUnits);

    app.get("/api/v1/businessUnits/:id", [ verifyBusinessUnitRequest.validateBusinessUnitId], businessUnitController.getBusinessUnit);

    app.patch("/api/v1/businessUnits/:id/enable", [ verifyBusinessUnitRequest.validateBusinessUnitId], businessUnitController.enableBusinessUnit);

    app.patch("/api/v1/businessUnits/:id/disable", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnitId], businessUnitController.disableBusinessUnit);

    app.patch("/api/v1/businessUnits/enable", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnitIds], businessUnitController.enableBusinessUnits);

    app.patch("/api/v1/businessUnits/disable", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnitIds], businessUnitController.disableBusinessUnits);

    app.delete("/api/v1/businessUnits/:id", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnitId], businessUnitController.deleteBusinessUnit);

    app.delete("/api/v1/businessUnits/", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnitIds], businessUnitController.deleteBusinessUnits);

    app.put("/api/v1/businessUnits/:id", [ verifyBusinessUnitRequest.validateUpdateBusinessUnitRequestBody, verifyBusinessUnitRequest.validateBusinessUnitId], businessUnitController.updateBusinessUnit);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const businessUnitController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}