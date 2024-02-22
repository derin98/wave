exports.createDepartmentObject = (req) => {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        name: req.body.firstName + " " + req.body.lastName,
        userId: req.userId,
        employeeId: req.body.employeeId,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        countryCode: req.body.countryCode,
        isEnabled: req.body.isEnabled ? req.body.isEnabled : true,
        imageId: req.body.imageId,
        eSignatureId: req.body.eSignatureId,
        businessUnitId: req.businessUnitId,
        departmentId: req.body.departmentId,
        userTypeId: req.body.userTypeId,
        designationId: req.body.designationId,
        userPermissionId: req.body.userPermissionId,
        teamId: req.body.teamId,
        userPasswordId: req.userPasswordId,
        createdBy: req.userId,
        updatedBy: req.userId
    };
}

exports.updateDepartmentObject = (req) => {
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
