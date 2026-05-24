const express = require("express");
const router = express.Router();
const taskModel = require("../models/taskModel");

// ✅ SINGLE ROUTE ONLY
router.post("/task-update", async (req, res) => {
  try {
    const { taskId, status, progress, result } = req.body;

    console.log("📩 Internal update:", req.body);

    // optional DB update (worker already does this)
    await taskModel.updateTask(taskId, {
      status,
      progress,
      result,
    });

    // 🔥 MAIN LINE
    global.io.emit("task_update", {
      taskId,
      status,
      progress,
      result,
    });

    res.json({ message: "update broadcasted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

module.exports = router;