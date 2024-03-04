const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../configs/auth/auth.config");
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler");
const userReqObjExtractor = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/user/user.reqObjExtractor");
const userService = require("../../../services/internalServices/UserManagement/user/user.services");
const userPasswordService = require("../../../services/internalServices/UserManagement/userPassword/userPassword.services");
const passwordGenerator = require('../../../utils/auth/passwordGenerator');
const passwordHasher = require('../../../utils/auth/passwordHasher');
const {createUserPasswordObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/userPassword/userPassword.reqObjExtractor");
const {createUserPasswordHistoryObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/userPasswordHistory/userPasswordHistory.reqObjExtractor");
const userPasswordHistoryService = require("../../../services/internalServices/UserManagement/userPasswordHistory/userPasswordHistory.services");
const {createUserPermission} = require("../../../services/internalServices/UserManagement/userPermission/userPermission.services");
const {createUserPermissionObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/userPermission/userPermission.reqObjExtractor");
const userPermissionService = require("../../../services/internalServices/UserManagement/userPermission/userPermission.services");
const permissionService = require("../../../services/internalServices/OrganizationManagement/permission/permission.services");
const {sendEmail} = require("../../../utils/mailer/mailer");
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
    let user = null;
    const selectFields = "userId,email,isSuperAdmin,employeeId"
    const populateFields = "userPassword,businessUnit,department,userType,designation,userPermission";
    if(req.body.userId) {
        let userDetails = {userId: req.body.userId}
        user = await userService.getUserForSignIn(userDetails, selectFields, populateFields);
    }
    else if (req.body.email) {
        let userDetails = {email: req.body.email}
        user = await userService.getUserForSignIn(userDetails, selectFields, populateFields);
    }
    else if (req.body.employeeId){
        let userDetails = {employeeId: req.body.employeeId}
        user = await userService.getUserForSignIn(userDetails, selectFields, populateFields);
    }
    else {
        return apiResponseHandler.errorResponse(res, "Failed! email or userId or employeeId is required", 400, null);
    }
    
    if (user == null) {
        res.status(400).send({
            message: "Failed! User doesn't exist!"
        });
        return;
    }
    if(!req.body.password){
        res.status(400).send({
            message : "Failed! Password is required"
        })
        return ;
    }
    let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.userPassword.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
    console.log(user, "user")


// Concatenate and filter permissions
    const allPermissions = [...user.designation.permissions, ...user.userPermission.positivePermissions];
    const negativePermissionsSet = new Set(user.userPermission.negativePermissions.map(String));

    const filteredPermissions = allPermissions.filter(permission => !negativePermissionsSet.has(String(permission)));

// Extract unique elements
    const uniquePermissions = [...new Set(filteredPermissions)];

// const userPermission = await userPermissionService.getUserPermissions(filteredPermissions, "", "permissionGroup")
    const userPermission = await permissionService.getPermissions(uniquePermissions, "", "permissionGroup")
    console.log('userPermission', userPermission)


    const permission = userPermission.reduce((acc, { name: permissionName, permissionGroup: { name: groupName } }) => {
        acc[groupName] ??= {};
        acc[groupName][permissionName] = true;
        return acc;
    }, {});

    console.log('resultObject', permission)
    let businessUnit = user.businessUnit;
    let designation = user.designation;
//delete userCount key in businessUnit
        if(businessUnit){
            delete businessUnit.userCount;
        }
    if(designation){
        delete designation.permissions;
    }
      let token = jwt.sign({ id: user.id, isSuperAdmin: user.isSuperAdmin, businessUnit, permission }, config.secret, {
        expiresIn: 60*60*60 // 24 hours
      });


      res.status(200).send({
          userId: user.userId,
          employeeId: user.employeeId,
        name : user.name,
        email: user.email,
        accessToken : token,
          designation,
          department: user.department, userType: user.department
      })
   
}

exports.signup = async (req, res) => {
    try {
        const userReqObj = userReqObjExtractor.createUserObject(req);
        const user = await userService.createUser(userReqObj);
        let generatedPassword = passwordGenerator.generateRandomPasswordString(8)
        console.log('generatedPassword', generatedPassword)
        let hashedPassword = await passwordHasher.hashPassword(generatedPassword);

        const userPasswordReqObj = createUserPasswordObject(user.id, hashedPassword);
        const userPassword = await userPasswordService.createUserPassword(userPasswordReqObj);

        const userPasswordHistoryReqObj = createUserPasswordHistoryObject(userPassword.id, hashedPassword);
        await userPasswordHistoryService.createUserPasswordHistory(userPasswordHistoryReqObj);

        const userPermissionReqObj = createUserPermissionObject(req, user.id);
        const userPermission = await createUserPermission(userPermissionReqObj);
        await userService.updateUserPasswordAndPermission(user.id, userPassword.id, userPermission.id);
        const message = "User created successfully";

           if(req.body.email){
               const userCredentials = {
                   employeeId: req.body.employeeId,
                   email: req.body.email,
                   password: generatedPassword,
               };
               await sendEmail(req.body.email, "Welcome to Wave!", userCredentials);
           }

        user.userPermission = userPermission.id;
        return apiResponseHandler.successResponse(res, message, user, 201);
    } catch (err) {
        console.log("Error while creating the user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

exports.initSignup = async (userReqObj, password) => {
    try {
        const user = await userService.createUser(userReqObj);
        let hashedPassword = await passwordHasher.hashPassword(password);
        const userPasswordReqObj = createUserPasswordObject(user.id, hashedPassword);
        const userPassword = await userPasswordService.createUserPassword(userPasswordReqObj);
        const userPasswordHistoryReqObj = createUserPasswordHistoryObject(userPassword.id, hashedPassword);
        await userPasswordHistoryService.createUserPasswordHistory(userPasswordHistoryReqObj);
        const userPermissionReqObj = createUserPermissionObject(req, user.id);
        const userPermission = await createUserPermission(userPermissionReqObj);
        await userService.updateUserPasswordAndPermission(user.id, userPassword.id, userPermission.id);
        return  user;
    } catch (err) {
        console.log("Error while creating the user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}









