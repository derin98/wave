const departmentController = require('../../../controllers/organizationManagement/department/department.controller');
const { verifyDepartmentReqBody, verifyBusinessUnitAfterAuth, authJwt } = require("../../../middlewares");

module.exports = function (app) {

    app.post("/api/v1/departments", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateCreateDepartmentRequestBody], departmentController.createDepartment);

    app.get("/api/v1/departments", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, ], departmentController.getAllDepartments);

    app.get("/api/v1/departments/:department", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartment], departmentController.getDepartment);

    app.patch("/api/v1/departments/:department/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartment], departmentController.enableDepartment);

    app.patch("/api/v1/departments/:department/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartment], departmentController.disableDepartment);

    app.patch("/api/v1/departments/enable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartments], departmentController.enableDepartments);

    app.patch("/api/v1/departments/disable", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartments], departmentController.disableDepartments);

    app.delete("/api/v1/departments/:department", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartment], departmentController.deleteDepartment);

    app.delete("/api/v1/departments/", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateDepartments], departmentController.deleteDepartments);

    app.put("/api/v1/departments/:department", [ authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnit, verifyDepartmentReqBody.validateUpdateDepartmentRequestBody, verifyDepartmentReqBody.validateDepartment], departmentController.updateDepartment);
//     app.get("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], const departmentController.findById);
//
//     app.put("/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin, verifyBusinessUnitRequestBody.validateCreateBusinessUnitRequestBody], constbusinessUnitController.update);
//
}