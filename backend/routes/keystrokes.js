
const express = require("express");

const router = express.Router();

const keystrokeController = require("../controllers/keystrokeController");

// =========================================================
// CAPTURE ON / OFF
// =========================================================

// POST /api/keystrokes/capture
router.post(
    "/capture",
    keystrokeController.setCapture
);

// GET /api/keystrokes/capture/status
router.get(
    "/capture/status",
    keystrokeController.getCaptureStatus
);

// =========================================================
// GET ACTIVITY LOGS
// =========================================================

// GET /api/keystrokes
router.get(
    "/",
    keystrokeController.getAll
);

// GET /api/keystrokes/recent?limit=100
router.get(
    "/recent",
    keystrokeController.getRecent
);

// GET /api/keystrokes/stats
router.get(
    "/stats",
    keystrokeController.getStats
);

// =========================================================
// DELETE LOGS
// =========================================================

// DELETE /api/keystrokes/range
//
// Body:
// {
//     "from": "2026-09-25T12:00:00",
//     "to": "2026-09-25T17:00:00"
// }
router.delete(
    "/range",
    keystrokeController.deleteByRange
);

// DELETE /api/keystrokes/date
//
// Body:
// {
//     "date": "2026-09-25"
// }
router.delete(
    "/date",
    keystrokeController.deleteByDate
);

// DELETE /api/keystrokes/last-days
//
// Body:
// {
//     "days": 1
// }
router.delete(
    "/last-days",
    keystrokeController.deleteLastDays
);

// =========================================================
// DOWNLOAD LOGS
// =========================================================

// GET /api/keystrokes/download
//
// Query:
// ?from=2026-09-25T12:00:00&to=2026-09-25T17:00:00
router.get(
    "/download",
    keystrokeController.downloadLogs
);

// GET /api/keystrokes/download-date
//
// Query:
// ?date=2026-09-25
router.get(
    "/download-date",
    keystrokeController.downloadByDate
);

// =========================================================
// AUTOMATIC RETENTION
// =========================================================

// POST /api/keystrokes/retention
//
// Body:
// {
//     "days": 30
// }
router.post(
    "/retention",
    keystrokeController.setRetention
);

// GET /api/keystrokes/retention
router.get(
    "/retention",
    keystrokeController.getRetention
);

module.exports = router;

