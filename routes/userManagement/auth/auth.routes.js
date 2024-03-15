// const authController = require('../../../controllers/userManagement/auth/auth.controller');
// const { verifyUserReq } = require("../../../middlewares");
// module.exports = function (app) {
//
//     app.post("/api/v1/auth/signup", [verifyUserReq.validateUserRequest], authController.signup);
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
    verifyUserReq,
    verifyTeamReqBody, authJwt } = require("../../../middlewares");
const departmentController = require("../../../controllers/organizationManagement/department/department.controller");
const userController = require("../../../controllers/userManagement/user/user.controller");

module.exports = function (app) {

    // app.post("/api/v1/auth/signup", authController.signup);

app.post("/api/v1/auth/signin", authController.signin);



    app.post("/api/v1/auth/signup", [
        authJwt.verifyToken,
        verifyBusinessUnitAfterAuth.verifyBusinessUnit,
        verifyDepartmentReqBody.validateDepartment, verifyUserTypeReqBody.validateUserType,
        verifyDesignationReqBody.validateDesignation, verifyTeamReqBody.validateTeam,
        // verifyUserReq.validateReportsTo,
        verifyUserReq.validateCreateUserRequest
    ], authController.signup);

}
