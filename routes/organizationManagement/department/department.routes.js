const departmentController = require('../../../controllers/organizationManagement/department/department.controller');
const { verifyDepartmentReqBody, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments", [ authJwt.verifyToken, verifyDepartmentReqBody.validateCreateDepartmentRequestBody], departmentController.createDepartment);

    app.get("/api/v1/departments",  departmentController.getAllDepartments);

    app.get("/api/v1/departments/:id", [ verifyDepartmentReqBody.validateDepartmentId], departmentController.getDepartment);

    app.patch("/api/v1/departments/:id/enable", [ verifyDepartmentReqBody.validateDepartmentId], departmentController.enableDepartment);

    app.patch("/api/v1/departments/:id/disable", [authJwt.verifyToken, verifyDepartmentReqBody.validateDepartmentId], departmentController.disableDepartment);

    app.patch("/api/v1/departments/enable", [authJwt.verifyToken, verifyDepartmentReqBody.validateDepartmentIds], departmentController.enableDepartments);

    app.patch("/api/v1/departments/disable", [authJwt.verifyToken, verifyDepartmentReqBody.validateDepartmentIds], departmentController.disableDepartments);

    app.delete("/api/v1/departments/:id", [authJwt.verifyToken, verifyDepartmentReqBody.validateDepartmentId], departmentController.deleteDepartment);

    app.delete("/api/v1/departments/", [authJwt.verifyToken, verifyDepartmentReqBody.validateDepartmentIds], departmentController.deleteDepartments);

    app.put("/api/v1/departments/:id", [ verifyDepartmentReqBody.validateUpdateDepartmentRequestBody, verifyDepartmentReqBody.validateDepartmentId], departmentController.updateDepartment);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const departmentController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}