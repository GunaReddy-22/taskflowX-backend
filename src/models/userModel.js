const pool = require("../config/db");

const createUser = async(email,password) =>{
    const result = await pool.query(
        "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",[email,password]
    );
    return result.rows[0];
};


const findUserByEmail = async(email) =>{
    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",[email]
    );
    return result.rows[0];
};

const saveRefreshToken =async(userId,token) =>{
    await pool.query(
        "UPDATE users SET refresh_token=$1 WHERE id=$2",[token,userId]
    );
};

const findUserById = async(id) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE id=$1",[id]
    );

    return result.rows[0];
};

const getLeastBusyWorker = async () => {
  const res = await pool.query(
    "SELECT * FROM users WHERE role = 'worker' LIMIT 1"
  );

  return res.rows[0];
};

const setWorkerOnline = async (userId, status) => {
  await pool.query(
    "UPDATE users SET is_online = $1 WHERE id = $2",
    [status, userId]
  );
};

const getLeastBusyOnlineWorker = async () => {
  const res = await pool.query(`
    SELECT u.id, u.max_tasks, COUNT(t.id)::int as task_count
    FROM users u
    LEFT JOIN tasks t 
      ON u.id = t.worker_id AND t.status IN ('assigned','processing')
    WHERE u.role = 'worker' AND u.is_online = true
    GROUP BY u.id, u.max_tasks
    HAVING COUNT(t.id) < u.max_tasks   -- 🔥 IMPORTANT
    ORDER BY task_count ASC
    LIMIT 1
  `);

  return res.rows[0];
};


const getAllWorkers = async () => {
  const res = await pool.query(
    "SELECT id, email FROM users WHERE role = 'worker'"
  );
  return res.rows;
};


module.exports = { createUser,findUserByEmail,saveRefreshToken,findUserById,getLeastBusyWorker,setWorkerOnline,getLeastBusyOnlineWorker,getAllWorkers};