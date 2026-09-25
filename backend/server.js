const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const corsOptions = require("./config/cors");
const routes = require("./routes");
const WebSocketController = require("./controllers/websocketController");
const keystrokeController = require("./controllers/keystrokeController");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors(corsOptions));
app.use(express.json());

// =========================================================
// API ROUTES
// =========================================================

app.use("/api", routes);

// =========================================================
// STATIC FILES
// =========================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// =========================================================
// WEBSOCKET
// =========================================================

const wsc =
    new WebSocketController(server);

wsc.init();

// =========================================================
// PORT
// =========================================================

const PORT =
    process.env.PORT || 3000;

// =========================================================
// AUTOMATIC ACTIVITY LOG CLEANUP
// =========================================================
//
// Runs every 1 hour.
//
// Example:
// retentionDays = 30
// → deletes logs older than 30 days
//
// retentionDays = 1
// → deletes logs older than 24 hours
//
// retentionDays = 7
// → deletes logs older than 7 days
// =========================================================

const startLogCleanup = () => {
    // Run once when the server starts
    keystrokeController.cleanupOldLogs();

    // Then run every hour
    setInterval(
        () => {
            keystrokeController.cleanupOldLogs();
        },
        60 * 60 * 1000
    );

    console.log(
        "Automatic activity log cleanup started"
    );
};

// =========================================================
// START SERVER
// =========================================================

const startServer = async () => {
    try {
        console.log(
            "Connecting to MongoDB..."
        );

        await connectDB();

        console.log(
            "MongoDB connection ready"
        );

        // Start automatic cleanup
        startLogCleanup();

        server.listen(
            PORT,
            () => {
                console.log(
                    `API: http://localhost:${PORT}/api`
                );

                console.log(
                    `WebSocket: ws://localhost:${PORT}`
                );
            }
        );

    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();

