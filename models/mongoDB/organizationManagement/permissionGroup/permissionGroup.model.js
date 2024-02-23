const mongoose = require("mongoose");

const permissionGroupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    businessUnitId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "BusinessUnit",
        required: true
    },
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

module.exports = mongoose.model("PermissionGroup", permissionGroupSchema, "permissionGroups");