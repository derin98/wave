const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    businessUnitId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "BusinessUnit",
        required: true
    },
    userTypeId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserType",
        required: true
    },
    permissionIds: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Permission",
    }],
    isEnabled: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        immutable: true,
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
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        // required: true,
    },
    updatedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        // required: true,
    }
})


const Designation = mongoose.model('Designation', designationSchema, "designations");

module.exports = Designation;



