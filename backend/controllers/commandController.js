const CommandLog = require("../models/CommandLog");

class CommandController {
    constructor() {
        this.pythonClient = null;
    }

    // =========================
    // SET PYTHON CLIENT
    // =========================

    setPythonClient(ws) {
        this.pythonClient = ws;
    }

    // =========================
    // SEND COMMAND TO PYTHON
    // POST /api/commands
    // =========================

    sendCommand = async (req, res) => {
        try {
            const { command } = req.body;

            if (!command || !command.trim()) {
                return res.status(400).json({
                    success: false,
                    error: "Command is required",
                });
            }

            if (
                !this.pythonClient ||
                this.pythonClient.readyState !== 1
            ) {
                return res.status(503).json({
                    success: false,
                    error: "Python client is not connected",
                });
            }

            this.pythonClient.send(
                JSON.stringify({
                    type: "command",
                    command: command.trim(),
                })
            );

            res.json({
                success: true,
                message: "Command sent successfully",
            });

        } catch (err) {
            console.error(
                "Send command error:",
                err.message
            );

            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    // =========================
    // CHECK PYTHON STATUS
    // GET /api/commands/status
    // =========================

    getStatus = (req, res) => {
        const connected =
            this.pythonClient &&
            this.pythonClient.readyState === 1;

        res.json({
            success: true,
            connected: Boolean(connected),
        });
    };

    // =========================
    // SAVE COMMAND OUTPUT
    // Called by WebSocketController
    // =========================

    async saveCommand(data) {
        try {
            const commandLog = await CommandLog.create({
                eventType: data.type || "cmd_output",
                output: data.data || "",
                timestamp: new Date(),
            });

            return commandLog;

        } catch (err) {
            console.error(
                "Failed to save command log:",
                err.message
            );

            throw err;
        }
    }
}

module.exports = new CommandController();