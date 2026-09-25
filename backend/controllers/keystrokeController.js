
const ActivityLog = require("../models/ActivityLog");

class KeystrokeController {
    constructor() {
        // Activity capture ON/OFF
        this.captureEnabled = true;

        // Automatic deletion retention
        // Default: 30 days
        this.retentionDays = 30;
    }

    // =========================================================
    // SAVE ACTIVITY
    // =========================================================
    async saveActivity(data) {
        try {
            if (!this.captureEnabled) {
                return null;
            }

            const activity = await ActivityLog.create({
                deviceId:
                    data.deviceId ||
                    "unknown-device",

                eventType:
                    data.eventType ||
                    "activity",

                keyType:
                    data.key ||
                    "OTHER",

                timestamp: new Date(),
            });

            return activity;

        } catch (err) {
            console.error(
                "Failed to save activity:",
                err.message
            );

            throw err;
        }
    }

    // =========================================================
    // CAPTURE ON / OFF
    // =========================================================
    setCapture = (req, res) => {
        try {
            const { enabled } = req.body;

            if (typeof enabled !== "boolean") {
                return res.status(400).json({
                    success: false,
                    error: "enabled must be true or false",
                });
            }

            this.captureEnabled = enabled;

            res.json({
                success: true,
                captureEnabled: this.captureEnabled,
                message: this.captureEnabled
                    ? "Activity capture enabled"
                    : "Activity capture disabled",
            });

        } catch (err) {
            console.error(
                "Set capture error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // GET CAPTURE STATUS
    // =========================================================
    getCaptureStatus = (req, res) => {
        res.json({
            success: true,
            captureEnabled:
                this.captureEnabled,
        });
    };

    // =========================================================
    // GET ALL LOGS
    // =========================================================
    getAll = async (req, res) => {
        try {
            const logs = await ActivityLog.find()
                .sort({ timestamp: -1 })
                .lean();

            const data = logs.map((log) => ({
                id: log._id,
                time: log.timestamp,
                key: log.keyType,
                deviceId: log.deviceId,
                eventType: log.eventType,
            }));

            res.json({
                success: true,
                count: data.length,
                data,
            });

        } catch (err) {
            console.error(
                "Get activity error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // GET RECENT LOGS
    // =========================================================
    getRecent = async (req, res) => {
        try {
            let limit =
                parseInt(req.query.limit) || 100;

            limit = Math.min(limit, 1000);

            const logs = await ActivityLog.find()
                .sort({ timestamp: -1 })
                .limit(limit)
                .lean();

            const data = logs.map((log) => ({
                id: log._id,
                time: log.timestamp,
                key: log.keyType,
                deviceId: log.deviceId,
                eventType: log.eventType,
            }));

            res.json({
                success: true,
                count: data.length,
                data,
            });

        } catch (err) {
            console.error(
                "Get recent activity error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // GET STATS
    // =========================================================
    getStats = async (req, res) => {
        try {
            const totalActivities =
                await ActivityLog.countDocuments();

            const latestLog =
                await ActivityLog.findOne()
                    .sort({
                        timestamp: -1,
                    })
                    .lean();

            res.json({
                success: true,

                totalKeystrokes:
                    totalActivities,

                lastUpdated:
                    latestLog
                        ? latestLog.timestamp
                        : null,

                captureEnabled:
                    this.captureEnabled,

                retentionDays:
                    this.retentionDays,
            });

        } catch (err) {
            console.error(
                "Get activity stats error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // PARSE DATE/TIME
    // =========================================================
    parseDateTime(value) {
        if (!value) {
            return null;
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    // =========================================================
    // DELETE LOGS BY EXACT DATE/TIME RANGE
    //
    // Example:
    //
    // {
    //   "from": "2026-09-25T12:00:00",
    //   "to": "2026-09-25T17:00:00"
    // }
    //
    // This deletes logs between 12 PM and 5 PM.
    // =========================================================
    deleteByRange = async (req, res) => {
        try {
            const { from, to } = req.body;

            if (!from || !to) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Both from and to date/time are required",
                });
            }

            const startDate =
                this.parseDateTime(from);

            const endDate =
                this.parseDateTime(to);

            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Invalid date/time format",
                });
            }

            if (startDate >= endDate) {
                return res.status(400).json({
                    success: false,
                    error:
                        "From date/time must be before To date/time",
                });
            }

            const result =
                await ActivityLog.deleteMany({
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                });

            res.json({
                success: true,

                deletedCount:
                    result.deletedCount,

                from: startDate,

                to: endDate,

                message:
                    `${result.deletedCount} activity log(s) deleted`,
            });

        } catch (err) {
            console.error(
                "Delete activity range error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // DELETE LOGS FOR ONE COMPLETE DAY
    //
    // Example:
    //
    // {
    //   "date": "2026-09-25"
    // }
    //
    // Deletes:
    // 25 Sep 00:00:00
    // ->
    // 25 Sep 23:59:59.999
    // =========================================================
    deleteByDate = async (req, res) => {
        try {
            const { date } = req.body;

            if (!date) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Date is required",
                });
            }

            const startDate =
                new Date(`${date}T00:00:00`);

            const endDate =
                new Date(`${date}T23:59:59.999`);

            if (
                Number.isNaN(
                    startDate.getTime()
                ) ||
                Number.isNaN(
                    endDate.getTime()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Invalid date",
                });
            }

            const result =
                await ActivityLog.deleteMany({
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                });

            res.json({
                success: true,

                deletedCount:
                    result.deletedCount,

                date,

                message:
                    `${result.deletedCount} activity log(s) deleted for ${date}`,
            });

        } catch (err) {
            console.error(
                "Delete activity by date error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // DELETE LAST N DAYS
    //
    // Example:
    //
    // {
    //   "days": 1
    // }
    //
    // Deletes logs from the last 24 hours.
    //
    // {
    //   "days": 7
    // }
    //
    // Deletes logs from the last 7 * 24 hours.
    // =========================================================
    deleteLastDays = async (req, res) => {
        try {
            const days =
                Number(req.body.days);

            if (
                !Number.isFinite(days) ||
                days <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Days must be greater than 0",
                });
            }

            const endDate = new Date();

            const startDate =
                new Date(
                    Date.now() -
                    days *
                    24 *
                    60 *
                    60 *
                    1000
                );

            const result =
                await ActivityLog.deleteMany({
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                });

            res.json({
                success: true,

                deletedCount:
                    result.deletedCount,

                from: startDate,

                to: endDate,

                days,

                message:
                    `${result.deletedCount} activity log(s) deleted from the last ${days} day(s)`,
            });

        } catch (err) {
            console.error(
                "Delete last days error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // DOWNLOAD LOGS BY DATE/TIME RANGE
    //
    // Example:
    //
    // GET
    // /api/keystrokes/download?from=2026-09-25T12:00:00&to=2026-09-25T17:00:00
    //
    // Downloads only logs inside that period.
    // =========================================================
    downloadLogs = async (req, res) => {
        try {
            const { from, to } = req.query;

            if (!from || !to) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Both from and to date/time are required",
                });
            }

            const startDate =
                this.parseDateTime(from);

            const endDate =
                this.parseDateTime(to);

            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Invalid date/time format",
                });
            }

            if (startDate >= endDate) {
                return res.status(400).json({
                    success: false,
                    error:
                        "From date/time must be before To date/time",
                });
            }

            const logs =
                await ActivityLog.find({
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                })
                    .sort({
                        timestamp: 1,
                    })
                    .lean();

            let output =
                "DEVICE ACTIVITY LOG\n";

            output +=
                "============================\n";

            output +=
                `Downloaded From: ${startDate.toLocaleString()}\n`;

            output +=
                `Downloaded To: ${endDate.toLocaleString()}\n`;

            output +=
                `Total Entries: ${logs.length}\n`;

            output +=
                "============================\n\n";

            logs.forEach((log, index) => {
                const dateTime =
                    new Date(
                        log.timestamp
                    ).toLocaleString();

                output +=
                    `${index + 1}. `;

                output +=
                    `[${dateTime}] `;

                output +=
                    `Device: ${
                        log.deviceId ||
                        "unknown-device"
                    } | `;

                output +=
                    `Event: ${
                        log.eventType ||
                        "activity"
                    } | `;

                output +=
                    `Key Type: ${
                        log.keyType ||
                        "OTHER"
                    }\n`;
            });

            res.setHeader(
                "Content-Type",
                "text/plain; charset=utf-8"
            );

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="activity-${startDate
                    .toISOString()
                    .slice(0, 10)}-${endDate
                    .toISOString()
                    .slice(0, 10)}.txt"`
            );

            res.send(output);

        } catch (err) {
            console.error(
                "Download activity error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // DOWNLOAD LOGS FOR ONE COMPLETE DAY
    //
    // Example:
    //
    // GET /api/keystrokes/download-date?date=2026-09-25
    // =========================================================
    downloadByDate = async (req, res) => {
        try {
            const { date } = req.query;

            if (!date) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Date is required",
                });
            }

            const startDate =
                new Date(`${date}T00:00:00`);

            const endDate =
                new Date(`${date}T23:59:59.999`);

            if (
                Number.isNaN(
                    startDate.getTime()
                ) ||
                Number.isNaN(
                    endDate.getTime()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Invalid date",
                });
            }

            const logs =
                await ActivityLog.find({
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                })
                    .sort({
                        timestamp: 1,
                    })
                    .lean();

            let output =
                "DEVICE ACTIVITY LOG\n";

            output +=
                "============================\n";

            output +=
                `Date: ${date}\n`;

            output +=
                `Total Entries: ${logs.length}\n`;

            output +=
                "============================\n\n";

            logs.forEach((log, index) => {
                const dateTime =
                    new Date(
                        log.timestamp
                    ).toLocaleString();

                output +=
                    `${index + 1}. `;

                output +=
                    `[${dateTime}] `;

                output +=
                    `Device: ${
                        log.deviceId ||
                        "unknown-device"
                    } | `;

                output +=
                    `Event: ${
                        log.eventType ||
                        "activity"
                    } | `;

                output +=
                    `Key Type: ${
                        log.keyType ||
                        "OTHER"
                    }\n`;
            });

            res.setHeader(
                "Content-Type",
                "text/plain; charset=utf-8"
            );

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="activity-${date}.txt"`
            );

            res.send(output);

        } catch (err) {
            console.error(
                "Download activity by date error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // SET AUTOMATIC RETENTION
    // =========================================================
    setRetention = (req, res) => {
        try {
            const days =
                Number(req.body.days);

            if (
                !Number.isInteger(days) ||
                days < 1 ||
                days > 3650
            ) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Retention days must be an integer between 1 and 3650",
                });
            }

            this.retentionDays = days;

            res.json({
                success: true,

                retentionDays:
                    this.retentionDays,

                message:
                    `Automatic activity retention set to ${days} days`,
            });

        } catch (err) {
            console.error(
                "Set retention error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================================================
    // GET RETENTION
    // =========================================================
    getRetention = (req, res) => {
        res.json({
            success: true,

            retentionDays:
                this.retentionDays,
        });
    };

    // =========================================================
    // AUTOMATIC DELETE OLD LOGS
    // =========================================================
    cleanupOldLogs = async () => {
        try {
            const cutoffDate =
                new Date(
                    Date.now() -
                    this.retentionDays *
                    24 *
                    60 *
                    60 *
                    1000
                );

            const result =
                await ActivityLog.deleteMany({
                    timestamp: {
                        $lt: cutoffDate,
                    },
                });

            if (
                result.deletedCount > 0
            ) {
                console.log(
                    `Automatic cleanup: ${result.deletedCount} old activity log(s) deleted`
                );
            }

            return result.deletedCount;

        } catch (err) {
            console.error(
                "Automatic log cleanup error:",
                err.message
            );

            return 0;
        }
    };
}

module.exports =
    new KeystrokeController();

