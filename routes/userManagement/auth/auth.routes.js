// const authController = require('../../../controllers/userManagement/auth/auth.controller');
// const { verifyUserReqBody } = require("../../../middlewares");
// module.exports = function (app) {
//
//     app.post("/api/v1/auth/signup", [verifyUserReqBody.validateUserRequestBody], authController.signup);
//
//     app.post("/api/v1/auth/signin", authController.signin);
//
//
// }



const authController = require('../../../controllers/userManagement/auth/auth.controller');
const {       verifyBusinessUnitRequest,
    verifyDepartmentReqBody,
    verifyUserTypeReqBody,
    verifyBusinessUnitAfterAuth,
    verifyDesignationReqBody,
    verifyPermissionGroupReqBody,
    verifyPermissionReqBody,
    verifyUserReqBody,
    verifyTeamReqBody, authJwt } = require("../../../middlewares");
const departmentController = require("../../../controllers/organizationManagement/department/department.controller");

module.exports = function (app) {

    app.post("/api/v1/auth/signup", [  authJwt.verifyToken, verifyBusinessUnitAfterAuth.verifyBusinessUnitId,
                                        verifyDepartmentReqBody.validateDepartmentId, verifyUserTypeReqBody.validateUserTypeId,
                            verifyDesignationReqBody.validateDesignationId, verifyPermissionGroupReqBody.validatePermissionGroupId,
                            verifyPermissionReqBody.validatePermissionId, verifyTeamReqBody.validateTeamId, verifyUserReqBody.validateUserRequestBody
                        ], authController.signup);

}