const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    platformFeePercentage: {
        type: Number,
        required: true,
        default: 10,
        min: 0,
        max: 100
    },
    studentRegistrationEnabled: {
        type: Boolean,
        required: true,
        default: true
    },
    instructorRegistrationEnabled: {
        type: Boolean,
        required: true,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({
            platformFeePercentage: 10,
            studentRegistrationEnabled: true,
            instructorRegistrationEnabled: true
        });
    }
    return settings;
};

module.exports = mongoose.model('Setting', settingSchema);
