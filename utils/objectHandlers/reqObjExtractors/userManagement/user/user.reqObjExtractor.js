// Description: Extracts the request object for user related operations.
exports.createUserObject = (req) => {
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

exports.updateUserObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.userId) {
        updateObject.userId = req.body.userId;
    }
    if (req.body.employeeId) {
        updateObject.employeeId = req.body.employeeId;
    }
    if (req.body.contactNumber) {
        updateObject.contactNumber = req.body.contactNumber;
    }
    if (req.body.countryCode) {
        updateObject.countryCode = req.body.countryCode;
    }
    if (req.body.imageId) {
        updateObject.imageId = req.body.imageId;
    }
    if (req.body.eSignatureId) {
        updateObject.eSignatureId = req.body.eSignatureId;
    }
    if (req.body.isEnabled !== undefined) {
        updateObject.isEnabled = req.body.isEnabled;
    }
    return updateObject;
}
