const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true, // it will convert the email into the lower case and then store in the db,
        minLength: 10,  // anything less than 10 will fail
        unique: true

    },
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    countryCode: {
        type: String,
        required: true,
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    imageId: {
        type: String,
        required: true,
        // default: "default"
    },
    eSignatureId: {
        type: String,
        required: true,
        // default: "default"
    },
    businessUnitId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "BusinessUnit",
        required: true
    },
    departmentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Department",
        required: true
    },
    userTypeId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserType",
        required: true
    },
    designationId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Designation",
        required: true
    },
    userPermissionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserPermission",
        required: true
    },
    userPasswordId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserPassword",
        required: true
    },
    teamId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Team",
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    reportsToId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        // I want to default to a new date
        type: Date,
        immutable: true,  // This will ensure the createdAt column is never updated but once in the start
        default: () => {
            return Date.now();
        }
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    },
    userType: {
        type: String,
        required: true,
        default: "CUSTOMER"
    },
    userStatus: {
        type: String,
        required: true,
        default: "APPROVED"
    }

})


module.exports = mongoose.model("User", userSchema);