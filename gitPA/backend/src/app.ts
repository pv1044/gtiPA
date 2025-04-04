import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRoutes from "./routes/githubRoutes";
import bodyParser from "body-parser";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api", chatRoutes);

app.use("/api/github", githubRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
