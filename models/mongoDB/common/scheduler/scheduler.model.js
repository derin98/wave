const mongoose = require("mongoose");

const schedulerSchema = new mongoose.Schema({
    scheduledModule: {
        type: String,
        // enum: ['User', 'Department', 'BusinessUnit'],  //
        required: true
    },
    scheduledModuleId: {
        type: String,
        // type: mongoose.SchemaTypes.ObjectId,
        required: true,
        // validate: {
        //     validator: async function(value) {
        //         const modelName = this.scheduledModule;
        //         const Model = mongoose.model(modelName);
        //         const count = await Model.countDocuments({ _id: value });
        //         return count > 0;
        //     },
        //     message: props => `${props.value} is not a valid ${props.path}`
        // }
    },
    scheduledTime:{
        type: Date,
        immutable: true,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => {
            return Date.now();
        }
    }
});

// Define models for each month
const schedulers = ['Month1Scheduler', 'Month2Scheduler', 'Month3Scheduler', 'Month4Scheduler', 'Month5Scheduler', 'Month6Scheduler', 'Month7Scheduler', 'Month8Scheduler', 'Month9Scheduler', 'Month10Scheduler', 'Month11Scheduler', 'Month12Scheduler', 'FullDayScheduler', 'HalfDayScheduler'];
const schedulerModels = {};

schedulers.forEach(scheduler => {
    const schedulerCamelCase = scheduler.charAt(0).toLowerCase() + scheduler.slice(1);
    schedulerModels[scheduler] = mongoose.model(scheduler, schedulerSchema, schedulerCamelCase);
});

module.exports = schedulerModels;
