// Description: Extracts the request object for user related operations.
exports.createUserPermissionObject = (req, user) => {
    return {
        user: user,
        createdBy: req.userId,
        updatedBy: req.userId
    };
}

exports.updateUserPermissionObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.positivePermissions) {
        updateObject.positivePermissions = req.body.positivePermissions;
    }
    if (req.body.negativePermissions) {
        updateObject.negativePermissions = req.body.negativePermissions;
    }
    return updateObject;
}

