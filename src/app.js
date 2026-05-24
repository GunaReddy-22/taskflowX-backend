const express = require("express");
const app = express();
const testroutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const internalRoutes = require("./routes/internalRoutes");
const userRoutes = require("./routes/userRoutes");



const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes);
app.use("/internal", internalRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("TaskFlow API running");
});

module.exports = app;