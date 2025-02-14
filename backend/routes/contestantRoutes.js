const express = require("express");
const router = express.Router();
const contestantController = require("../controllers/contestantController");

// Route to get contestant profile
router.get("/:id", contestantController.getContestantProfile);

// Route to update contestant profile
router.put("/:id", contestantController.updateContestantProfile);

module.exports = router;
