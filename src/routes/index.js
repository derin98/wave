
function routeInit(app) {
    require('./organizationManagement/team/team.routes')(app);
    require('./organizationManagement/permission/permission.routes')(app);
    require('./organizationManagement/permissionGroup/permissionGroup.routes')(app);
    require('./organizationManagement/designation/designation.routes')(app);
    require('./organizationManagement/userType/userType.routes')(app);
    require('./organizationManagement/department/department.routes')(app);
    require('./organizationManagement/businessUnit/businessUnit.routes')(app);
    require('./userManagement/auth/auth.routes')(app);
    require('./userManagement/user/user.routes')(app);
    require('./userManagement/userPermission/userPermission.routes')(app);
}
module.exports = {
    routeInit,
};