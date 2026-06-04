from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# Conexão
MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client['saturnlabs']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de Teste
@app.get("/api/test")
async def test():
    return {"message": "API rodando com sucesso"}

# Rota de Login (O frontend envia para /api/auth/login)
@app.post("/api/auth/login")
async def login(data: dict):
    # Por enquanto, estamos apenas permitindo que o login passe
    return {
        "session_token": "token-valido-123",
        "user": {"email": data.get("email"), "name": "Admin", "is_admin": True}
    }

# Rota para verificar usuário
@app.get("/api/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "Admin", "is_admin": True}
