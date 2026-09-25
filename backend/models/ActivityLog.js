const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: true,
            trim: true,
        },

        eventType: {
            type: String,
            required: true,
            trim: true,
        },

        keyType: {
            type: String,
            default: "OTHER",
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);