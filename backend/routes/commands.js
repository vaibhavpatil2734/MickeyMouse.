const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");

// POST /api/commands - Send command to Python client
router.post("/", commandController.sendCommand);

// GET /api/commands/status - Check if Python client connected
router.get("/status", commandController.getStatus);

module.exports = router;