const authController = require('../../../controllers/userManagement/auth/auth.controller');
const { verifyUserReqBody } = require("../../../middlewares");
module.exports = function (app) {

    app.post("/crm/api/v1/auth/signup", [verifyUserReqBody.validateUserRequestBody], authController.signup);

    app.post("/crm/api/v1/auth/signin", authController.signin);


}