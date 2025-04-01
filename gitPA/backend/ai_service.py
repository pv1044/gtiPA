from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# Load OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    query: str

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": request.query}],
        )
        return {"response": response["choices"][0]["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
