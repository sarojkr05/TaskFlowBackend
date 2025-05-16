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

dotenv.config();
connectDB();

const app = express();
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
app.use("/task-within-project", tasksInProjectsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
