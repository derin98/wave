const User = require("../../../models/mongoDB/userManagement/user/user.model");
const { userTypes } = require("../../../utils/constants");
const constants = require("../../../utils/constants");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../../../configs/auth/auth.config");
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler");
// const {createUserObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/auth/auth.reqObjExtractor");
/**
 * Controller for the signup flow
 */
// exports.signup = async (req, res) => {
//     try {
//         const userReqObj = createUserObject(req);
//         userReqObj.password = bcrypt.hashSync(req.body.password, 8);
//         console.log('userReqObj', userReqObj)
//         const user = await authService.signUp(userReqObj);
//         const message = "User created successfully";
//         return apiResponseHandler.successResponse(res, message, user, 201);
//     } catch (err) {
//         console.log("Error while creating the user", err.message);
//         return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
//     }
// }


/**
 * Controller for the sign in flow
 */

exports.signin = async (req, res)=> {

    //Fetch the userManagement based on the userId
    //Validating the userId
    const user = await User.findOne({ userId: "65d30a07b472a72c39f0feda" }).populate('businessUnitId');

    console.log(user);
    if (user == null) {
        res.status(400).send({
            message: "Failed! Userid doesn't exist!"
        });
        return;
    }
    if(!req.body.password){
        res.status(400).send({
            message : "Invalid Password!"
        })
        return ;
    }
    console.log(req.body.password, user.password);
    //Checking if the password matches
    var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      console.log(user.userId)
      var token = jwt.sign({ id: user._id, isSuperAdmin: user.isSuperAdmin, businessUnitId: user.businessUnitId }, config.secret, {
        expiresIn: 60*60 // 1 hour
      });

      res.status(200).send({
        name : user.name,
        userId : user.userId,
        email: user.email,
        userTypes : user.userType,
        userStatus : user.userStatus,
        accessToken : token
      })
   
}












