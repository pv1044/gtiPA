import { Request, Response } from "express";
import axios from "axios";
import { OpenAI } from "openai";
import dotenv from "dotenv";


const openai = new OpenAI({ apiKey: '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' });
const GITHUB_API_BASE = "https://api.github.com/repos";

// Extract owner & repo from URL
const extractRepoInfo = (url: string): { owner: string; repo: string } | null => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

// Fetch file contents from GitHub API
const fetchFileContent = async (owner: string, repo: string, filePath: string) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/${owner}/${repo}/contents/${filePath}`, {
      headers: { "User-Agent": "GitHub-Bot" },
    });

    // Decode Base64 content
    return response.data.content ? Buffer.from(response.data.content, "base64").toString("utf-8") : null;
  } catch (error) {
    console.warn(`Could not fetch ${filePath}`);
    return null;
  }
};
export const analyzeRepository = async (req: Request, res: Response): Promise<void> => {
  const repoUrl = req.query.url as string;

  if (!repoUrl) {
    res.status(400).json({ error: "Repository URL is required" });
    return;
  }

  const repoInfo = extractRepoInfo(repoUrl);
  if (!repoInfo) {
    res.status(400).json({ error: "Invalid GitHub repository URL" });
    return;
  }

  const { owner, repo } = repoInfo;
  try {
    // Fetch important files
    const readme = await fetchFileContent(owner, repo, "README.md");
    const packageJson = await fetchFileContent(owner, repo, "package.json");
    // const requirementsTxt = await fetchFileContent(owner, repo, "requirements.txt");

    // Construct OpenAI prompt
    const prompt = `
      Given the following repository files, provide:
      1. A brief summary of the repository's purpose.
      2. Identify key technologies/frameworks used.
      3. Provide any structural insights.

      README.md:
      ${readme || "No README available"}

      package.json:
      ${packageJson || "No package.json available"}
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are an AI that analyzes GitHub repositories." }, { role: "user", content: prompt }],
      max_tokens: 300,
    });

    const analysis = response.choices[0].message.content;

    res.json({ owner, repo, analysis });
  } catch (error: any) {
    console.error("Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze repository" });
  }
};
