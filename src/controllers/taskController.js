const taskQueue = require("../config/queue");
const taskModel =require("../models/taskModel");
const userModel = require("../models/userModel");

const createTask = async(req,res) =>{
    const io = req.app.get("io");
    try{
        const { title,description,priority } = req.body;

        if(!title) return res.status(400).json({error:"title required"});

        const fileUrl = req.file ? req.file.path : null;

        console.log("BODY:", req.body);
console.log("FILE:", req.file);

        const userId = req.user.id;
        const task = await taskModel.createTask(
            title,
            description,priority || "medium",
            userId,fileUrl);
            
        await taskQueue.add(
  "process-task",
  {
    taskId: task.id,
    title: task.title,
  },
  {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    jobId: `task-${task.id}`, // 🔥 VERY IMPORTANT (prevents duplicate jobs)
  }
);
        console.log("Task pushed to queue:", task.id);
        io.emit("task_created",task);
       

        res.status(201).json(task);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Failed to create task"});
    }
};

const getTasks = async (req, res) => {
  try {
    const user = req.user;
    let tasks;

    if (user.role === "admin") {
      // 🔥 ADMIN → ALL TASKS
      tasks = await taskModel.getAllTasks();
    } else if (user.role === "worker") {
      tasks = await taskModel.getTasksByWorker(user.id);
    } else {
      tasks = await taskModel.getTasksByUser(user.id);
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch tasks" });
  }
};

const getTaskById = async(req,res) =>{
    try{
        const {id} = req.params;
        const task = await taskModel.getTaskById(id);

        if(!task) {
            return res.status(404).json({error:"Task not found"});
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({error :" Error in fetching task"});
    }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      result,
      progress,
      result_url, // ✅ ADD THIS
    } = req.body;

    const updated = await taskModel.updateTask(id, {
      status,
      result,
      progress,
      result_url, // ✅ PASS THIS
    });

    // 🔥 SOCKET UPDATE
    req.app.get("io").emit("task_update", updated);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error updating task" });
  }
};



module.exports ={
    createTask,
    getTasks,
    getTaskById,
    updateTask,
}

