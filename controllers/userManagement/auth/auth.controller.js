const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../configs/auth/auth.config");
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler");
const userReqObjExtractor = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/user/user.reqObjExtractor");
const userManager = require("../../../managers/internalManagers/userManagement/user/user.managers");
const userPasswordManager = require("../../../managers/internalManagers/userManagement/userPassword/userPassword.managers");
const teamManager = require("../../../managers/internalManagers/organizationManagement/team/team.managers");
const passwordGenerator = require('../../../utils/auth/passwordGenerator');
const passwordHasher = require('../../../utils/auth/passwordHasher');
const {createUserPasswordObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/userPassword/userPassword.reqObjExtractor");
const {createUserPasswordHistoryObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/userPasswordHistory/userPasswordHistory.reqObjExtractor");
const userPasswordHistoryManager = require("../../../managers/internalManagers/userManagement/userPasswordHistory/userPasswordHistory.managers");
const {createUserPermission} = require("../../../managers/internalManagers/userManagement/userPermission/userPermission.managers");
const {createUserPermissionObject} = require("../../../utils/objectHandlers/reqObjExtractors/userManagement/userPermission/userPermission.reqObjExtractor");
const permissionManager = require("../../../managers/internalManagers/organizationManagement/permission/permission.managers");
const {sendEmail} = require("../../../utils/mailer/mailer");
const cryptoConfigs = require('../../../configs/encryption/crypto.config.js');
const {decrypt, decryptCBC} = require('../../../utils/encryption/crypto');
const businessUnitManager = require("../../../managers/internalManagers/organizationManagement/businessUnit/businessUnit.managers");
const {appConstant} = require("../../../utils/constants");
/**
 * Controller for the signup flow
 */
// exports.signup = async (req, res) => {
//     try {
//         const userReqObj = createUserObject(req);
//         userReqObj.password = bcrypt.hashSync(req.body.password, 8);
//         console.log('userReqObj', userReqObj)
//         const user = await authManager.signUp(userReqObj);
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

exports.signin = async (req, res) => {
    const selectFields = "buUserId,email,isSuperAdmin,employeeId";
    const populateFields = "userPassword,businessUnit,department,userType,designation,userPermission";

    async function getUserByField(field, value) {
        let userDetails = { [field]: value };
        return await userManager.getUserForSignIn(userDetails, selectFields, populateFields);
    }

    function decryptPassword(encPass, secretKey) {
       try {
            return decrypt(encPass, secretKey);
        }
        catch (err) {
            console.log("Invalid Password!", err.message);
            return null;
        }
    }

    let user = null;
    if (req.body.buUserId) {
        user = await getUserByField('buUserId', req.body.buUserId);
    } else if (req.body.email) {
        user = await getUserByField('email', req.body.email);
    } else if (req.body.employeeId) {
        user = await getUserByField('employeeId', req.body.employeeId);
    } else {
        return apiResponseHandler.errorResponse(res, "Failed! email or buUserId or employeeId is required", 400, null);
    }
    let password = req.body.password;

    let dcrptPass;
    const source = req.body.source;
    if (source === cryptoConfigs.CRYPTO_SRC_0_NAME) {
        dcrptPass = password;
    } else if (source === cryptoConfigs.CRYPTO_SRC_1_NAME) {
        dcrptPass =password
        dcrptPass = decryptCBC(password, cryptoConfigs.CRYPTO_SECRET_KEY_SRC_1);
    } else if (source === cryptoConfigs.CRYPTO_SRC_2_NAME) {
        dcrptPass = decryptPassword(password, cryptoConfigs.CRYPTO_SECRET_KEY_SRC_2);
    } else if (source === cryptoConfigs.CRYPTO_SRC_3_NAME) {
        dcrptPass = decryptPassword(password, cryptoConfigs.CRYPTO_SECRET_KEY_SRC_3);
    } else if (source === cryptoConfigs.CRYPTO_SRC_4_NAME) {
        dcrptPass = decryptPassword(password, cryptoConfigs.CRYPTO_SECRET_KEY_SRC_4);
    } else {
        return apiResponseHandler.errorResponse(res, "Failed! Invalid source", 400, null);
    }

    if (user == null) {
        return apiResponseHandler.errorResponse(res, "Failed! User doesn't exist!", 400, null);
    }

    if (!dcrptPass) {
        return apiResponseHandler.errorResponse(res, "Failed! Password is required", 400, null);
    }

    let passwordIsValid = bcrypt.compareSync(dcrptPass, user.userPassword.password);

    if (!passwordIsValid) {
        return apiResponseHandler.errorResponse(res, "Failed! Invalid Password!", 401, null);
    }

    // Concatenate and filter permissions
    const allPermissions = [...user.designation.permissions, ...user.userPermission.positivePermissions];
    const negativePermissionsSet = new Set(user.userPermission.negativePermissions.map(String));

    const filteredPermissions = allPermissions.filter(permission => !negativePermissionsSet.has(String(permission)));

// Extract unique elements
    const uniquePermissions = [...new Set(filteredPermissions)];

// const userPermission = await userPermissionManager.getUserPermissions(filteredPermissions, "", "permissionGroup")
    const userPermission = await permissionManager.getPermissions(uniquePermissions, "", "permissionGroup")
    //
    const permission = userPermission.reduce((acc, { name: permissionName, permissionGroup: { name: groupName } }) => {
        acc[groupName] ??= {};
        acc[groupName][permissionName] = true;
        return acc;
    }, {});

    let businessUnit = user.businessUnit;
    let designation = user.designation;

    if (businessUnit) {
        delete businessUnit.usersCount;
    }

    if (designation) {
        delete designation.permissions;
    }

    let token = jwt.sign({ id: user.id, isSuperAdmin: user.isSuperAdmin, businessUnit, permission }, config.secret, {
        expiresIn: 60 * 60 * 60 // 24 hours
    });

    return apiResponseHandler.successResponse(res, "User signed in successfully", {
        accessToken: token,
        user: {
            name: user.name,
            email: user.email,
            employeeId: user.employeeId,
            buUserId: user.buUserId,
            designation,
            department: user.department,
            userType: user.userType,
        }
    }, 200);
};

exports.signup = async (req, res) => {
    try {
        const userReqObj = userReqObjExtractor.createUserObject(req);
        const buUserIdAndName = await businessUnitManager.returnNewBuUserIdAndName(req.businessUnit)
        const businessUnitName = buUserIdAndName.name;
        userReqObj.buUserId = buUserIdAndName.buUserId;
        const user = await userManager.createUser(userReqObj);
        if (user) {
            await businessUnitManager.updateBusinessUnitUserCountByOne(req.businessUnit);
            if(req.team){
            await teamManager.appendUsersToTeam(req.team, [user.id]);
            }
            let generatedPassword = passwordGenerator.generateRandomPasswordString(8)
            console.log('generatedPassword', generatedPassword)
            let hashedPassword = passwordHasher.hashPassword(generatedPassword);
            const userPasswordReqObj = createUserPasswordObject(user.id, hashedPassword);
            const userPassword = await userPasswordManager.createUserPassword(userPasswordReqObj);
            console.log(2222)
            const userPasswordHistoryReqObj = createUserPasswordHistoryObject(userPassword.id, hashedPassword);
            await userPasswordHistoryManager.createUserPasswordHistory(userPasswordHistoryReqObj);

            const userPermissionReqObj = createUserPermissionObject(req, user.id);
            const userPermission = await createUserPermission(userPermissionReqObj);
            await userManager.updateUserPasswordAndPermission(user.id, userPassword.id, userPermission.id);
            const message = "User created successfully";

            if (req.body.email) {
                const userCredentials = {
                    buUserId: userReqObj.buUserId,
                    employeeId: req.body.employeeId,
                    email: req.body.email,
                    password: generatedPassword,
                };
                await sendEmail(req.body.email, `Welcome to ${appConstant.appName} ${businessUnitName}!`, userCredentials);
            }

            user.userPermission = userPermission.id;
            return apiResponseHandler.successResponse(res, message, user, 201);
        }
        else {
            return apiResponseHandler.errorResponse(res, "Failed! User not created", 400, null);
        }
    } catch (err) {
        console.log("Error while creating the user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

exports.initSignup = async (userReqObj, password) => {
    try {
        const user = await userManager.createUser(userReqObj);
        const req = {
            userId: user.id
        }
        let hashedPassword = await passwordHasher.hashPassword(password);
        const userPasswordReqObj = createUserPasswordObject(user.id, hashedPassword);
        const userPassword = await userPasswordManager.createUserPassword(userPasswordReqObj);
        const userPasswordHistoryReqObj = createUserPasswordHistoryObject(userPassword.id, hashedPassword);
        await userPasswordHistoryManager.createUserPasswordHistory(userPasswordHistoryReqObj);
        const userPermissionReqObj = createUserPermissionObject(req, user.id);
        const userPermission = await createUserPermission(userPermissionReqObj);
        await userManager.updateUserPasswordAndPermission(user.id, userPassword.id, userPermission.id);
        return user;
    } catch (err) {
        console.log("Error while creating the user", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}









