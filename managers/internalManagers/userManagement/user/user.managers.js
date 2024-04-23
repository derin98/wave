const UserOperations = require('../../../../dbOperations/mongoDB/userManagement/user/user.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const userResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/userManagement/user/user.resObjConverter');
const permissionManager = require("../../organizationManagement/permission/permission.managers");


async function createUser(userObject) {
    const user = await UserOperations.createUser(userObject);
    return userResObjConverter.userCreateResponse(user);
}

async function getAllUsers(req) {
    let query = {
        isEnabled: true,
        isDeleted: false,
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    if(req.departments) {
        query.department = { $in: req.departments };
    }
    if(req.userTypes) {
        query.userType = { $in: req.userTypes };
    }
    if(req.designations) {
        query.designation = { $in: req.designations };
    }
    if(req.userTypes) {
        query.userType = { $in: req.userTypes };
    }
    if(req.teams) {
        query.team = { $in: req.teams };
    }
    if(req.reportsTos) {
        query.reportsTo = { $in: req.reportsTos };
    }
    if (req.query.withoutTeam === 'true') {
        query.team = null;
    }
    if (req.query.createdAt) {
        query.createdAt = req.createdAt;
    }
    if (req.query.updatedAt) {
        query.updatedAt = req.updatedAt;
    }
    // console.log("query", query)
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }
    let populateFields = req.query.populateFields;
    let selectFields = req.query.selectFields;

    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countUsers = await UserOperations.countUsers(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countUsers, []);
    }
    const users = await UserOperations.getAllUsers(query, sort, order, page, limit, skip, selectFields, populateFields);
    const totalPages = countUsers === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countUsers / limit));

// If populateFields contains userPermission
    if (populateFields.includes('userPermission')) {
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            
            // Check if user has userPermission, positivePermissions, and negativePermissions, if not, initialize them as empty arrays
            if (!user.userPermission) {
                user.userPermission = { positivePermissions: [], negativePermissions: [] };
            }
            if (!user.userPermission.positivePermissions) user.userPermission.positivePermissions = [];
            if (!user.userPermission.negativePermissions) user.userPermission.negativePermissions = [];
        
            // Concatenate and filter permissions
            let positivePermissions = [...user.userPermission.positivePermissions];
            const negativePermissionsSet = new Set(user.userPermission.negativePermissions.map(String));
            const negativePermissions = [...negativePermissionsSet];
            
            // Only get permissions if there are positivePermissions or negativePermissions
            if (positivePermissions.length > 0) {
                const userPositivePermission = await permissionManager.getPermissions(positivePermissions, "", "permissionGroup");
        
                let modifiedPositivePermissions = userPositivePermission.reduce((acc, { id, name: permissionName, permissionGroup: { name: groupName } }) => {
                    acc[groupName] ??= {};
                    acc[groupName][permissionName] = { id };
                    return acc;
                }, {});
        
                user.userPermission.positivePermissions = modifiedPositivePermissions;
            }
        
            if (negativePermissions.length > 0) {
                const userNegativePermission = await permissionManager.getPermissions(negativePermissions, "", "permissionGroup");
        
                let modifiedNegativePermissions = userNegativePermission.reduce((acc, { name: permissionName, permissionGroup: { name: groupName } }) => {
                    acc[groupName] ??= {};
                    acc[groupName][permissionName] = true;
                    return acc;
                }, {});
        
                user.userPermission.negativePermissions = modifiedNegativePermissions;
            }
        }
        
    }


    return paginationHandler.paginationResObj(page, totalPages, countUsers, users);
}

async function getUser(_id, selectFields, populateFields, businessUnit) {
    let query = {
        _id: _id,
        // isEnabled: true,
        isDeleted: false
    };
    console.log("query", query, selectFields, populateFields)
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}


async function getUserByEmail(email, selectFields, populateFields, businessUnit) {
    let query = {
        email: email,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function getUserByEmployeeId(employeeId, selectFields, populateFields, businessUnit) {
    let query = {
        employeeId: employeeId,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function getUserByBuUserId(buUserId, selectFields, populateFields, businessUnit) {
    let query = {
        buUserId: buUserId,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].filter(field => field !== 'userPassword').join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].filter(field => field !== 'userPassword').join(' ')
        : ['name', '_id'];


    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function getUserForSignIn(userDetails, selectFields, populateFields, businessUnit) {
    let query = {
        // isEnabled: true,
        isDeleted: false
    };
    if (userDetails.email) {
        query.email = userDetails.email;
    }
    else if (userDetails.buUserId) {
        query.buUserId = userDetails.buUserId;
    }
    else if (userDetails.employeeId) {
        query.employeeId = userDetails.employeeId;
    }
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].join(' ')
        : "";
    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].join(' ')
        : ['name', '_id'];

    return await UserOperations.getUser(query, selectFields, populateFields);
}

async function enableUser(req) {
    let query = {
        _id: req.params.user,
        // isEnabled: false,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    let updateObj = {
        isEnabled: true,
        updatedBy: req.userId
    }
    return await UserOperations.updateUser(query, updateObj);
}

async function enableUsers(req) {
    let query = {
        _id: {$in: req.body.users},
        // isEnabled: false,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    let updateObj = {
        isEnabled: true,
        updatedBy: req.userId
    }
    return await UserOperations.updateUsers(query, updateObj);
}

async function disableUser(req) {
    let query = {
        _id: req.params.user,
        // isEnabled: false,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    let updateObj = {
        isEnabled: false,
        updatedBy: req.userId
    }
    return await UserOperations.updateUser(query, updateObj);
}


async function disableUsers(req) {
    let query = {
        _id: {$in: req.body.users},
        // isEnabled: false,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    let updateObj = {
        isEnabled: false,
        updatedBy: req.userId
    }
    return await UserOperations.updateUsers(query, updateObj);
}

async function deleteUser(req) {
    let query = {
        _id: req.params.user,
        // isEnabled: false,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    let updateObj = {
        isDeleted: true,
        updatedBy: req.userId
    }
    return await UserOperations.updateUser(query, updateObj);
}

async function deleteUsers(req) {
    let query = {
        _id: {$in: req.body.users},
        // isEnabled: false,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    let updateObj = {
        isDeleted: true,
        updatedBy: req.userId
    }
    return await UserOperations.updateUsers(query, updateObj);
}

async function updateUser(req, updateObject) {
    let query = {
        _id: req.params.user,
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    if(!updateObject.updatedBy){
        updateObject.updatedBy = req.userId
    }
    return await UserOperations.updateUser(query, updateObject);
}

async function updateUsers(req, updateObject) {
    let query = {
        _id: {$in: req.body.users},
        isDeleted: false
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }
    return await UserOperations.updateUsers(query, updateObject);
}
async function updateUserPasswordAndPermission(id, userPassword, userPermission) {
    let query = {
        _id: id,
        isDeleted: false
    };
    return await UserOperations.updateUser(query, {userPassword, userPermission});
}
async function removeTeamFromUsers(users) {
    let query = {
        _id: {$in: users},
        isDeleted: false
    };
    return await UserOperations.updateUsers(query, {team: null});

}
// async function getTotalAndEnabledUsers() {
//     const aggregationPipeline = [
//         {
//             $group: {
//                 _id: null,
//                 totalUsers: { $sum: 1 },
//                 enabledUsers: {
//                     $sum: {
//                         $cond: [
//                             { $and: [{ $eq: ["$isDeleted", false] }, { $eq: ["$isEnabled", true] }] },
//                             1,
//                             0
//                         ]
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0, // Exclude the _id field
//                 totalUsers: 1,
//                 enabledUsers: 1
//             }
//         }
//     ];
//     return await UserOperations.getUsersByAggregation(aggregationPipeline) || { totalUsers: 0, enabledUsers: 0 };;
// }
async function getTotalAndEnabledUsers(req) {
    try {
        let query = { isDeleted: false };

        if (req.businessUnit) {
            query.businessUnit = req.businessUnit;
        }

        const totalUsers = await UserOperations.countUsers(query);

        query.isEnabled = true;

        const enabledUsers = await UserOperations.countUsers(query);

        return { totalUsers, enabledUsers };
    } catch (error) {
        console.error('Error in getUserStatistics:', error);
        return null;
    }
}


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUserByEmail,
    getUserByEmployeeId,
    getUserByBuUserId,
    getUserForSignIn,
    enableUser,
    enableUsers,
    disableUser,
    disableUsers,
    deleteUser,
    deleteUsers,
    updateUser,
    updateUsers,
    updateUserPasswordAndPermission,
    removeTeamFromUsers,
    getTotalAndEnabledUsers,
};