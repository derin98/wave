const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    businessUnit: {
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
        required: true,
    },
    updatedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    }
})

module.exports = mongoose.model("Department", departmentSchema, "departments");