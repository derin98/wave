const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    businessUnit: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "BusinessUnit",
        required: true
    },
    permissionGroup: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "PermissionGroup",
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


const Permission = mongoose.model('Permission', permissionSchema, "permissions");

module.exports = Permission;



