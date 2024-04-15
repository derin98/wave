exports.createDesignationObject = (req) => {
    return {
        name: req.body.name,
        userType: req.params.userType,
        businessUnit: req.businessUnit,
        permissions: req.body.permissions ? req.body.permissions : [],
        isEnabled: req.body.isEnabled ? req.body.isEnabled : true,
        createdBy: req.userId,
        updatedBy: req.userId
    };
}

exports.updateDesignationObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.name) {
        updateObject.name = req.body.name;
    }
    if (req.body.isEnabled !== undefined) {
        updateObject.isEnabled = req.body.isEnabled;
    }
    if (req.body.permissions) {
        updateObject.permissions = req.body.permissions;
    }
    return updateObject;
}


exports.updateDesignationsPermissionsObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.name) {
        updateObject.name = req.body.name;
    }
    if (req.body.isEnabled !== undefined) {
        updateObject.isEnabled = req.body.isEnabled;
    }
    if (req.body.permissions) {
        updateObject.permissions = req.body.permissions;
    }
    return updateObject;
}
