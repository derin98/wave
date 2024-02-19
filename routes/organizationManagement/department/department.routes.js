const departmentController = require('../../../controllers/organizationManagement/department/department.controller');
const { verifyDepartmentReqBody, verifyBusinessUnitAfterAuth, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateCreateDepartmentRequestBody], departmentController.createDepartment);

    app.get("/api/v1/departments", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, ], departmentController.getAllDepartments);

    app.get("/api/v1/departments/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentId], departmentController.getDepartment);

    app.patch("/api/v1/departments/:id/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentId], departmentController.enableDepartment);

    app.patch("/api/v1/departments/:id/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentId], departmentController.disableDepartment);

    app.patch("/api/v1/departments/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentIds], departmentController.enableDepartments);

    app.patch("/api/v1/departments/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentIds], departmentController.disableDepartments);

    app.delete("/api/v1/departments/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentId], departmentController.deleteDepartment);

    app.delete("/api/v1/departments/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateDepartmentIds], departmentController.deleteDepartments);

    app.put("/api/v1/departments/:id", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId, verifyDepartmentReqBody.validateUpdateDepartmentRequestBody, verifyDepartmentReqBody.validateDepartmentId], departmentController.updateDepartment);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const departmentController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}