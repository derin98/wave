const AuthOperations = require('../../../../dbOperations/mongoDB/organizationManagement/auth/auth.dbOperations');
const authResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/userManagement/auth/auth.resObjConverter');


async function signUp(userObject) {
    const user = await AuthOperations.createDepartment(userObject);
    return authResObjConverter.authSignUpResponse(user);
}

module.exports = {
    signUp
};