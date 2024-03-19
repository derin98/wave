exports.createTeamObject = (req) => {
    return {
        name: req.body.name,
        businessUnit: req.businessUnit,
        department: req.department,
        users: req.body.users ? req.body.users : [],
        isEnabled: req.body.isEnabled ? req.body.isEnabled : true,
        createdBy: req.userId,
        updatedBy: req.userId
    };
}

exports.updateTeamObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.name) {
        updateObject.name = req.body.name;
    }
    if (req.body.isEnabled !== undefined) {
        updateObject.isEnabled = req.body.isEnabled;
    }
    if (req.body.appendUsers) {
        updateObject.appendUsers = req.body.appendUsers
    }

    if (req.body.removeUsers) {
        updateObject.removeUsers = req.body.removeUsers;
    }
    return updateObject;
}
