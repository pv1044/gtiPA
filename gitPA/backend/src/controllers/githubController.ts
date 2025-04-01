import { Request, Response } from "express";
import axios from "axios";

export const getRepositoryFiles = async (req: Request, res: Response): Promise<void> => {
  const repoUrl = req.query.url as string;

  if (!repoUrl) {
    res.status(400).json({ error: "Repository URL is required" });
    return;
  }

  try {
    const repoData = await axios.get(`${repoUrl}/contents`);
    res.json(repoData.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repository files" });
  }
};
