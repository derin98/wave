/**
 * This file will be the start point of the application.
 */
const serverConfig = require('./configs/server/server.config');
const {MONGO_DB_URL} = require('./configs/db/mongoDb.config');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const authController = require('./controllers/userManagement/auth/auth.controller');
const userManagers = require('./managers/internalManagers/userManagement/user/user.managers');
const businessUnitManagers = require('./managers/internalManagers/organizationManagement/businessUnit/businessUnit.managers');
const departmentManagers = require('./managers/internalManagers/organizationManagement/department/department.managers');
const userTypeManagers = require('./managers/internalManagers/organizationManagement/userType/userType.managers');
const designationManagers = require('./managers/internalManagers/organizationManagement/designation/designation.managers');
const permissionGroupManagers = require('./managers/internalManagers/organizationManagement/permissionGroup/permissionGroup.managers');
const permissionManagers = require('./managers/internalManagers/organizationManagement/permission/permission.managers');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :true}));


/**
 * Configuring CORS
 * Current configuration ensures access from everywhere
 * Think twice, while doing the same in the Production.
 *
 */
app.use(cors());

/**
 * DB Connection initialization
 */

mongoose.connect(MONGO_DB_URL);
const db = mongoose.connection;
db.on("error", ()=>{
    console.log("error while connecting to DB");
});
db.once("open",async () => {
    console.log("connected to Mongo DB ")
    await init();
});

/**
 *
 * @returns
 * ideally one ADMIN userManagement should have been created in the backend
 */
async function init() {

    let user;
    let businessUnit;
    let department;
    let permissionGroup;
    let permission;
    let userType;
    let designation;


    const userCreation = {
        firstName: "Super",
        lastName: "Admin",
        employeeId: "superAdmin",
        buUserId: "ADM1"
    }
    const password = "adm!n@1234";


    const businessUnitCreation = {
        name: "Admin",
        shortName: "ADM",
    }

    const departmentCreation = {
        name: "Administration",
    }

    const permissionGroupCreation = {
        name: "Admin",
    }

    const permissionCreation = {
        name: "Admin",
    }

    const userTypeCreation = {
        name: "Super Administrator",
    }

    const designationCreation = {
        name: "Super Admin",
    }

    user = await userManagers.getUserByEmployeeId(userCreation.employeeId);
    if (user) {
        console.log("Admin user already present");
        return;
    }

    try {
        const userObj = {
            isSuperAdmin: true,
            firstName: userCreation.firstName,
            lastName: userCreation.lastName,
            name: userCreation.firstName + " " + userCreation.lastName,
            employeeId: userCreation.employeeId,
            isEnabled: true,
            buUserId: userCreation.buUserId,
        }

        user = await authController.initSignup(userObj, password)
        console.log("Admin user created successfully  =====>  ", user);

        try{
            const businessUnitObj = {
                name: businessUnitCreation.name,
                shortName: businessUnitCreation.shortName.toUpperCase(),
                usersCount: 1,
                isEnabled: true,
                createdBy: user.id,
                updatedBy: user.id
            }
            businessUnit = await businessUnitManagers.getBusinessUnitByName(businessUnitObj.name, undefined,"usersCount");
            if(!businessUnit){
                businessUnit = await businessUnitManagers.createBusinessUnit(businessUnitObj);
                console.log("Default business unit created successfully  =====>  ", businessUnit);
            }

        } catch (e) {
            console.log(e.message);
        }

        try{
            const departmentObj = {
                name: departmentCreation.name,
                businessUnit: businessUnit.id,
                isEnabled: true,
                createdBy: user.id,
                updatedBy: user.id
            }
            department = await departmentManagers.getDepartmentByName(departmentObj.name, businessUnit.id);
            if(!department){
                department = await departmentManagers.createDepartment(departmentObj);
                console.log("Default department created successfully  =====>  ", department);
            }
        } catch (e) {
            console.log(e.message);
        }

        try{
            const permissionGroupObj = {
                name: permissionGroupCreation.name,
                businessUnit: businessUnit.id,
                isEnabled: true,
                createdBy: user.id,
                updatedBy: user.id
            }

            permissionGroup = await permissionGroupManagers.getPermissionGroupByName(permissionGroupObj.name, businessUnit.id);
            if(!permissionGroup){
                permissionGroup = await permissionGroupManagers.createPermissionGroup(permissionGroupObj);
                console.log("Default permissionGroup created successfully  =====>  ", permissionGroup);
            }
        } catch (e) {
            console.log(e.message);
        }
        try{
            const permissionObj = {
                name: permissionCreation.name,
                businessUnit: businessUnit.id,
                permissionGroup: permissionGroup.id,
                isEnabled: true,
                createdBy: user.id,
                updatedBy: user.id
            }

            permission = await permissionManagers.getPermissionByName(permissionObj.name, businessUnit.id);
            if(!permission){
                permission = await permissionManagers.createPermission(permissionObj);
                console.log("Default permission created successfully  =====>  ", permission);
            }
        } catch (e) {
            console.log(e.message);
        }

        try{
            const userTypeObj = {
                name: userTypeCreation.name,
                businessUnit: businessUnit.id,
                department: department.id,
                isEnabled: true,
                createdBy: user.id,
                updatedBy: user.id
            }

            userType = await userTypeManagers.getUserTypeByName(userTypeObj.name, businessUnit.id);
            if(!userType){
                userType = await userTypeManagers.createUserType(userTypeObj);
                console.log("Default userType created successfully  =====>  ", userType);
            }
        } catch (e) {
            console.log(e.message);
        }
        try{
            const designationObj = {
                name: designationCreation.name,
                businessUnit: businessUnit.id,
                permissions: [permission.id],
                department: department.id,
                userType: userType.id,
                isEnabled: true,
                createdBy: user.id,
                updatedBy: user.id
            }

            designation = await designationManagers.getDesignationByName(designationObj.name, businessUnit.id);
            if(!designation){
                designation = await designationManagers.createDesignation(designationObj);
                console.log("Default designation created successfully  =====>  ", designation);
            }
        } catch (e) {
            console.log(e.message);
        }

        const userUpdateObj = {
            businessUnit: businessUnit.id,
            department: department.id,
            userType: userType.id,
            designation: designation.id,
            updatedBy: user.id,
            reportsTo: user.id
        }
        let req = {params:{user:user.id}}

        await userManagers.updateUser(req, userUpdateObj);

    } catch (e) {
        console.log(e.message);
    }





}



/**
 * importing the routes
 */
require('./routes/organizationManagement/team/team.routes')(app);
require('./routes/organizationManagement/permission/permission.routes')(app);
require('./routes/organizationManagement/permissionGroup/permissionGroup.routes')(app);
require('./routes/organizationManagement/designation/designation.routes')(app);
require('./routes/organizationManagement/userType/userType.routes')(app);
require('./routes/organizationManagement/department/department.routes')(app);
require('./routes/organizationManagement/businessUnit/businessUnit.routes')(app);
require('./routes/userManagement/auth/auth.routes')(app);
require('./routes/userManagement/user/user.routes')(app);

app.listen(serverConfig.PORT, () => {
    console.log(`Application started on the port num : ${serverConfig.PORT}`);
})