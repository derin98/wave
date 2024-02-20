exports.createPermissionGroupObject = (req) => {
    return {
        name: req.body.name,
        description: req.body.description,
        businessUnitId: req.businessUnitId,
        isEnabled: req.body.isEnabled ? req.body.isEnabled : true,
        createdBy: req.userId,
        updatedBy: req.userId
    };
}

exports.updatePermissionGroupObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.name) {
        updateObject.name = req.body.name;
    }
    if (req.body.description) {
        updateObject.description = req.body.description;
    }
    if (req.body.isEnabled !== undefined) {
        updateObject.isEnabled = req.body.isEnabled;
    }
    return updateObject;
}
