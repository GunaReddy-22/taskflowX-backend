const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const taskModel = require("./models/taskModel");
const axios = require("axios");
const userModel = require("./models/userModel");
const taskQueue = require("./config/queue"); // 🔥 ADD THIS

const connection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

const notify = async (data) => {
  try {
    await axios.post("http://backend:8080/internal/task-update", data);
  } catch (err) {
    console.log("⚠️ Notify failed:", err.message);
  }
};

const worker = new Worker(
  "task-queue",
  async (job) => {
    const { taskId } = job.data;

    console.log(`🚀 Processing task ${taskId}`);

    // 🔥 FIND LEAST BUSY ONLINE WORKER
    const workerData = await userModel.getLeastBusyOnlineWorker();

    if (!workerData) {
  console.log("⚠️ All workers busy → keep pending");

  await taskModel.updateTask(taskId, {
    status: "pending",
  });

  await notify({
    taskId,
    status: "pending",
  });

  return;
}

    // 🔥 ASSIGN TASK
    const updated = await taskModel.updateTask(taskId, {
      worker_id: workerData.id,
      status: "assigned",
      progress: 0,
    });

    await notify(updated);

    console.log(`✅ Task ${taskId} assigned to worker ${workerData.id}`);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", async (job) => {
  console.log(`❌ Job failed: ${job.id}`);
});

setInterval(async () => {
  console.log("🔁 Checking pending tasks...");

  const pendingTasks = await taskModel.getPendingTasks();

  for (const task of pendingTasks) {
   await taskQueue.add(
  "process-task",
  { taskId: task.id },
  { jobId: `task-${task.id}` } // 🔥 prevents duplicates
);
  }
}, 10000);