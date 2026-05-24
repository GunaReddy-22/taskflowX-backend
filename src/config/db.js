const { Pool} = require("pg");

const  pool = new Pool({
    user:"postgres",
    host:"postgres",
    database:"taskflow",
    password:"password",
    port:5432,
});

module.exports = pool;