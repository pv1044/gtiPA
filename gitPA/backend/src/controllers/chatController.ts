import { Request, Response } from "express";
import axios from "axios";

export const handleChatRequest = async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required." });

  try {
    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: query }],
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    res.json({ response: openAIResponse.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI request failed." });
  }
};
