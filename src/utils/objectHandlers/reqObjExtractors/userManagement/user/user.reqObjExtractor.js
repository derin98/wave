// Description: Extracts the request object for user related operations.
exports.createUserObject = (req) => {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        name: req.body.firstName + " " + req.body.lastName,
        buUserId: req.body.buUserId,
        employeeId: req.body.employeeId,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        countryCode: req.body.countryCode,
        isEnabled: req.body.isEnabled ? req.body.isEnabled : true,
        reportsTo: req.body.reportsTo,
        userImage: req.body.imageId,
        eSignature: req.body.eSignatureId,
        businessUnit: req.businessUnit,
        department: req.body.department,
        userType: req.body.userType,
        designation: req.body.designation,
        team: req.body.team,
        createdBy: req.userId,
        updatedBy: req.userId
    };
}

exports.updateUserObject = (req) => {
    const updateObject = {
        updatedBy: req.userId
    };
    if (req.body.firstName || req.body.lastName) {
        if (req.body.firstName && req.body.lastName) {
            updateObject.firstName = req.body.firstName;
            updateObject.lastName = req.body.lastName;
            updateObject.name = req.body.firstName + " " + req.body.lastName;
        }
        else if (req.body.firstName) {
            updateObject.firstName = req.body.firstName;
            updateObject.name = req.body.firstName + " " + req.userObj.lastName;
        }
        else {
            updateObject.lastName = req.body.lastName;
            updateObject.name = req.userObj.firstName + " " + req.body.lastName;
        }
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
    if (req.department) {
        updateObject.department = req.department;
        if(!req.team){
            updateObject.team = null;
        }
    }
    if (req.userType) {
        updateObject.userType = req.userType;
    }
    if (req.designation) {
        updateObject.designation = req.designation;
    }
    if (req.team) {
        updateObject.team = req.team;
    }
    if (req.body.isEnabled !== undefined) {
        updateObject.isEnabled = req.body.isEnabled;
    }
    if (req.body.reportsTo) {
        updateObject.reportsTo = req.body.reportsTo;
    }
    return updateObject;
}


exports.fetchUsers = async (data, selectFields, populateFields) => {
    if (selectFields) {
        data = this.applySelect(data, selectFields);
    }

    if (populateFields) {
        data = this.applyPopulate(data, populateFields);
    }

    return await data.lean();
}

exports.fetchUser = async (data, selectFields, populateFields) => {
    if (selectFields) {
        data = this.applySelect(data, selectFields);
    }

    if (populateFields) {
        data = this.applyPopulate(data, populateFields);
    }
    console.log("data11111", data);
    // return data

    const result = await data;
    console.log("result", result);
    if (result) {
        const { _id, ...rest } = result;
        return { ...rest, id: _id };
    }

    return null;
}

exports.applyPopulate = async (queryObject, populateFields) => {
    const populateFieldsArray = populateFields.split(',');
    const populateFieldsWithoutSystemFields = populateFieldsArray.filter(field => !['createdAt', 'updatedAt', '__v', 'isEnabled', 'isDeleted', 'createdBy', 'updatedBy', 'userType', 'department', 'businessUnit'].includes(field.trim()));

    return await queryObject.populate({
        path: populateFieldsWithoutSystemFields.join(' '),
        select: '-createdAt -updatedAt -__v -isEnabled -isDeleted -createdBy -updatedBy -userType -department -businessUnit',
        options: {
            lean: true,
            transform: doc => {
                const { _id, ...rest } = doc;
                return { ...rest, id: _id };
            },
        },
    });
}


exports.applySelect = (queryObject, selectFields) => {
    return queryObject.select(selectFields);
}

exports.executeQuery = async (queryObject) => {
    const result = await queryObject.lean();
    console.log("result", result);
    if (result) {
        const { _id, ...rest } = result;
        return { ...rest, id: _id };
    }

    return null;
}