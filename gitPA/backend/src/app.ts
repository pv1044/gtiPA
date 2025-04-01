import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRoutes from "./routes/githubRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

// ✅ Correct usage: Ensure the router is mounted correctly
app.use("/api/github", githubRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
