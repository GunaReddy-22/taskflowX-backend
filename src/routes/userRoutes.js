const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/workers", authMiddleware, async (req, res) => {
  try {
    const workers = await userModel.getAllWorkers();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

module.exports = router;