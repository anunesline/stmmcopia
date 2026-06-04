from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de Login ESSENCIAL
@app.post("/api/auth/login")
async def login(data: dict):
    email = data.get("email")
    # Para teste, vamos ver se pelo menos essa rota responde
    return {
        "session_token": "token-valido-123",
        "user": {"email": email, "name": "Admin", "is_admin": True}
    }

@app.get("/api/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "MM Admin", "is_admin": True}
