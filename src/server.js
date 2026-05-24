require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.set("io", io);
global.io =io;

pool.connect()
   .then(()=>{console.log("postgtres connected")})
   .catch((err)=>{console.log("DB connection error",err)});


io.on("connection", (socket) => {
    console.log("user connected:",socket.id);

    socket.on("disconnect",() =>{
        console.log("User disconnected:", socket.id);
    });
});
{/*app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
}); */}

server.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
});

