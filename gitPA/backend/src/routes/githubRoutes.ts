import { Router } from "express";
import { getRepositoryFiles } from "../controllers/githubController";

const router = Router();

router.get("/repo", getRepositoryFiles); // Ensure correct usage

export default router;
