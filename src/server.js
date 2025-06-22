import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConfig.js";
import userRouter from "./routes/userRoutes.js";
import router from "./routes/authRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import tasksInProjectsRouter from "./routes/tasksWithinProjects.js";
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";
import notificationRouter from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Setup socket.io
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173" || "https://taskflowa.netlify.app", // frontend origin
    credentials: true,
  },
});

export const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Registered user:", userId);
  });

  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cookieParser())


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use("/users", userRouter);
app.use("/auth", router);
app.use("/tasks", taskRouter);
app.use("/projects", projectRouter);
app.use("/projects", tasksInProjectsRouter);
app.use("/notifications", notificationRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server with Socket.io running on port ${process.env.PORT}`);
});
