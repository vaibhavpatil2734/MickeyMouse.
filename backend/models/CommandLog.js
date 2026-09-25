const mongoose = require("mongoose");

const CommandLogSchema = new mongoose.Schema(
    {
        eventType: {
            type: String,
            default: "cmd_output",
        },

        output: {
            type: String,
            default: "",
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

module.exports = mongoose.model("CommandLog", CommandLogSchema);