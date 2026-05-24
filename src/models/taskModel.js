const pool = require("../config/db");

const createTask = async(title,description,priority,userId,fileUrl) =>{
    const result = await pool.query(
        `INSERT INTO tasks (title,description,priority,user_id,worker_id,file_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,[title,description,priority,userId,null,fileUrl]
    );
    return result.rows[0];
};

const getALLTasks = async(userId,limit=10,offset=0) =>{
    const result = await pool.query(`SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,[userId,limit,offset]);
    return result.rows;
};

const getAllTasks = async () => {
  const res = await pool.query(
    "SELECT * FROM tasks ORDER BY id DESC"
  );
  return res.rows;
};

const getTaskById = async(id) =>{
    const result = await pool.query(
        `SELECT * FROM tasks WHERE id = $1;`,[id]
    );
    return result.rows[0];
};

const updateTask = async (id, data) => {
  const {
    status,
    result,
    progress,
    retry_count,
    started_at,
    completed_at,
    worker_id,
    result_url, // ✅ ADD THIS
  } = data;

  const res = await pool.query(
    `UPDATE tasks SET 
      status = COALESCE($1, status),
      result = COALESCE($2, result),
      progress = COALESCE($3, progress),
      retry_count = COALESCE($4, retry_count),
      started_at = COALESCE($5, started_at),
      completed_at = COALESCE($6, completed_at),
      worker_id = COALESCE($7, worker_id),
      result_url = COALESCE($8, result_url)  -- ✅ ADD THIS
      WHERE id = $9 RETURNING *;`,
    [
      status,
      result,
      progress,
      retry_count,
      started_at,
      completed_at,
      worker_id,
      result_url, // ✅
      id,
    ]
  );

  return res.rows[0];
};

const getTasksByWorker = async (workerId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE worker_id = $1 ORDER BY id DESC",
    [workerId]
  );
  return result.rows;
};

const getTasksByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC",
    [userId]
  );
  return result.rows;
};

const getPendingTasks = async () => {
  const res = await pool.query(
    "SELECT * FROM tasks WHERE status = 'pending'"
  );
  return res.rows;
};
module.exports = {
    createTask,getALLTasks,getTaskById,updateTask,getTasksByWorker,getTasksByUser,getAllTasks,getPendingTasks
}