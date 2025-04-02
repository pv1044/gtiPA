// import { Router } from "express";
// import { getRepositoryFiles } from "../controllers/githubController";

// const router = Router();

// router.get("/repo", getRepositoryFiles); // Ensure correct usage

// export default router;


import { Router } from "express";
import { analyzeRepository } from "../controllers/githubController"; // Only import analyzeRepository

const router = Router();

router.get("/analyze", analyzeRepository);  // Route for AI analysis

export default router;
