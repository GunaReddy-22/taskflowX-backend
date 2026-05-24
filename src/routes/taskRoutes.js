const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");
const upload = require("../config/upload");
const taskModel = require("../models/taskModel");

// ✅ CREATE TASK WITH FILE
router.post(
  "/",
  authMiddleware,
  rateLimiter,
  upload.single("file"),
  createTask
);

// ✅ GET TASKS
router.get("/", authMiddleware, getTasks);

// ✅ GET BY ID
router.get("/:id", authMiddleware, getTaskById);

// ✅ UPDATE TASK
router.put("/:id", authMiddleware, updateTask);

// ✅ ASSIGN TASK
router.post("/assign", authMiddleware, async (req, res) => {
  const { taskId, workerId } = req.body;

  await taskModel.updateTask(taskId, {
    worker_id: workerId,
    status: "assigned",
  });

  req.app.get("io").emit("task_update", {
    taskId,
    worker_id: workerId,
    status: "assigned",
  });

  res.json({ message: "Task assigned" });
});

// ✅ UPLOAD RESULT
router.post(
  "/upload-result/:id",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;

    const resultUrl = req.file.path;

    const updated = await taskModel.updateTask(id, {
      status: "completed",
      result: "done",
      result_url: resultUrl,
      progress:100,
    });

    global.io.emit("task_update", {
      taskId: id,
      status: "completed",
      result_url: resultUrl,
    });

    res.json(updated);
  }
);

module.exports = router;