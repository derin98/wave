const businessUnitController = require('../../../controllers/organizationManagement/businessUnit/businessUnit.controller');
const { verifyBusinessUnitRequest, authJwt, verifyBusinessUnitAfterAuth} = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/businessUnits", [ authJwt.verifyToken, verifyBusinessUnitRequest.validateCreateBusinessUnitRequestBody], businessUnitController.createBusinessUnit);

    app.get("/api/v1/businessUnits",  [authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit ], businessUnitController.getAllBusinessUnits);

    app.get("/api/v1/businessUnits/:businessUnit", [ authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnit], businessUnitController.getBusinessUnit);

    app.patch("/api/v1/businessUnits/:businessUnit/enable", [ authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnit], businessUnitController.enableBusinessUnit);

    app.patch("/api/v1/businessUnits/:businessUnit/disable", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnit], businessUnitController.disableBusinessUnit);

    app.patch("/api/v1/businessUnits/enable", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnits], businessUnitController.enableBusinessUnits);

    app.patch("/api/v1/businessUnits/disable", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnits], businessUnitController.disableBusinessUnits);

    app.delete("/api/v1/businessUnits/:businessUnit", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnit], businessUnitController.deleteBusinessUnit);

    app.delete("/api/v1/businessUnits/", [authJwt.verifyToken, verifyBusinessUnitRequest.validateBusinessUnits], businessUnitController.deleteBusinessUnits);

    app.put("/api/v1/businessUnits/:businessUnit", [ authJwt.verifyToken, verifyBusinessUnitRequest.validateUpdateBusinessUnitRequestBody, verifyBusinessUnitRequest.validateBusinessUnit], businessUnitController.updateBusinessUnit);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const businessUnitController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], const businessUnitController.update);
//
}