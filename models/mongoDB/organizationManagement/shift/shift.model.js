const mongoose = require("mongoose");
const { shiftModeOfWork } = require("../../../../utils/constants");
const { inOffice, remote, hybrid } = shiftModeOfWork;

const shiftSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    businessUnit: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "BusinessUnit",
        required: true
    },
    isWorkTimeFixed: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: String,
        validate: {
            validator: function(v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(v); // Regular expression to validate time format (HH:mm:ss)
            },
            message: props => `${props.value} is not a valid 24-hour time format with seconds!`
        }
    },
    endTime: {
        type: String,
        validate: {
            validator: function(v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(v); // Regular expression to validate time format (HH:mm:ss)
            },
            message: props => `${props.value} is not a valid 24-hour time format with seconds!`
        }
    },
    modeOfWork: {
        type: String,
        enum: [inOffice, remote, hybrid],
        required: true
    },
    defaultClockOutTime: {
        type: String,
        validate: {
            validator: function(v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(v); // Regular expression to validate time format (HH:mm:ss)
            },
            message: props => `${props.value} is not a valid 24-hour time format with seconds!`
        },
        required: true
    },
    inOfficeCheckClockInOutLocation: {
        type: Boolean,
        default: false
    },
    checkClockInOutLocation:{
        type: Boolean,
        default: false
    },
    inOfficeDaysPerMonth: {
        firstWeek: {
            monday: { type: Boolean, default: false },
            tuesday: { type: Boolean, default: false },
            wednesday: { type: Boolean, default: false },
            thursday: { type: Boolean, default: false },
            friday: { type: Boolean, default: false },
            saturday: { type: Boolean, default: false },
            sunday: { type: Boolean, default: false }
        },
        secondWeek: {
            monday: { type: Boolean, default: false },
            tuesday: { type: Boolean, default: false },
            wednesday: { type: Boolean, default: false },
            thursday: { type: Boolean, default: false },
            friday: { type: Boolean, default: false },
            saturday: { type: Boolean, default: false },
            sunday: { type: Boolean, default: false }
        },
        thirdWeek: {
            monday: { type: Boolean, default: false },
            tuesday: { type: Boolean, default: false },
            wednesday: { type: Boolean, default: false },
            thursday: { type: Boolean, default: false },
            friday: { type: Boolean, default: false },
            saturday: { type: Boolean, default: false },
            sunday: { type: Boolean, default: false }
        },
        fourthWeek: {
            monday: { type: Boolean, default: false },
            tuesday: { type: Boolean, default: false },
            wednesday: { type: Boolean, default: false },
            thursday: { type: Boolean, default: false },
            friday: { type: Boolean, default: false },
            saturday: { type: Boolean, default: false },
            sunday: { type: Boolean, default: false }
        },
        fifthWeek: {
            monday: { type: Boolean, default: false },
            tuesday: { type: Boolean, default: false },
            wednesday: { type: Boolean, default: false },
            thursday: { type: Boolean, default: false },
            friday: { type: Boolean, default: false },
            saturday: { type: Boolean, default: false },
            sunday: { type: Boolean, default: false }
        }
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
    }
});


module.exports = mongoose.model("Shift", shiftSchema, "Shifts");