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
    buUserId: {
        type: String,
        required: function() {
            return !this.isSuperAdmin;
        },
        unique: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    email: {
        type: String,
        required: function() {
            return !this.isSuperAdmin;
        },
        lowercase: true, // it will convert the email into the lower case and then store in the db,
        minLength: 10,  // anything less than 10 will fail
        unique: true

    },
    contactNumber: {
        type: String,
        required: function() {
            return !this.isSuperAdmin;
        },
        unique: true
    },
    countryCode: {
        type: String,
        required: function() {
            return !this.isSuperAdmin;
        },
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userImage: {
        type: String,
        // required: function() {
        //     return !this.isSuperAdmin;
        // },
        ref: "UserImage",
        // default: "default"
    },
    eSignature: {
        type: String,
        // required: function() {
        //     return !this.isSuperAdmin;
        // },
        ref: "ESignature",
        // default: "default"
    },
    businessUnit: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "BusinessUnit",
        required: function() {
            return !this.isSuperAdmin;
        },
    },
    department: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Department",
        required: function() {
            return !this.isSuperAdmin;
        },
    },
    userType: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserType",
        required: function() {
            return !this.isSuperAdmin;
        },
    },
    designation: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Designation",
        required: function() {
            return !this.isSuperAdmin;
        },
    },
    userPermission: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserPermission",
        // required: function() {
        //     return !this.isSuperAdmin;
        // },
    },
    userPassword: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserPassword",
        // required: true
    },
    team: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Team"
    },
    reportsTo: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        default: function () {
            return this.isSuperAdmin ? this._id : null;
        },
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
        default: function () {
            return this.isSuperAdmin ? this._id : null;
        },
    },
    updatedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
        default: function () {
            return this.isSuperAdmin ? this._id : null;
        },
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
    }

})


module.exports = mongoose.model("User", userSchema);