import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env variables are loaded

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_KEY = "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"

if (!OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing. Check your .env file.");
  process.exit(1);
}

export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    console.log("API Key Loaded");
    console.log("Sending request to OpenAI with query:", message);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log("OpenAI Response Received:", response.data);
    res.json(response.data);
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI request failed.",
      details: error.response?.data || error.message,
    });
  }
};
