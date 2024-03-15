exports.createTeamObject = (req) => {
    return {
        name: req.body.name,
        businessUnit: req.businessUnit,
        department: req.department,
        users: req.body.users ? req.body.users : [],
        usersCount: req.body.users ? req.body.users.length : 0,
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
    return updateObject;
}
