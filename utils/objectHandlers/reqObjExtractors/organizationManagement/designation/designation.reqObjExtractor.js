exports.createDesignationObject = (req) => {
    return {
        name: req.body.name,
        userTypeId: req.params.userTypeId,
        businessUnitId: req.businessUnitId,
        permissionIds: req.body.permissionIds ? req.body.permissionIds : [],
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
    if (req.body.permissionIds) {
        updateObject.permissionIds = req.body.permissionIds;
    }
    return updateObject;
}
