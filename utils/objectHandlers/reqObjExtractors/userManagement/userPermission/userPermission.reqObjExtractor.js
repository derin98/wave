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

