const {Queue} = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Redis connected ✅");
});

const taskQueue = new Queue("task-queue",{
    connection,
});

module.exports = taskQueue;
