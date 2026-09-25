
const express = require("express");

const router = express.Router();

// Existing routes

const commandRoutes = require("./commands");

// Activity / keystroke routes
const keystrokeRoutes = require("./keystrokes");

// =========================================================
// API ROUTES
// =========================================================


router.use("/commands", commandRoutes);

router.use("/keystrokes", keystrokeRoutes);

module.exports = router;

