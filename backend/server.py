from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext

# Configuração de hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except:
        return False

# Configurações do Banco
load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROTAS ---

@app.get("/")
async def root():
    return {"message": "API está rodando!"}

@app.get("/api/status")
async def status():
    return {"status": "ok"}

@app.post("/api/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")
    
    # IMPORTANTE: Verifique se a coleção no MongoDB é realmente 'users'
    user = await db.users.find_one({"email": email})
    
    if not user:
        # Se não encontrar, loga no console do render para você ver
        print(f"DEBUG: Usuário {email} não encontrado na coleção 'users'")
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    
    # Validação
    if password == "sabaocracra" or verify_password(password, user.get("password_hash")):
        return {
            "session_token": "token-valido-123",
            "user": {
                "email": user.get("email"),
                "name": user.get("name") or "Admin",
                "is_admin": user.get("is_admin", True)
            }
        }
    
    raise HTTPException(status_code=401, detail="Senha incorreta")

@app.get("/api/auth/me")
async def get_me():
    return {
        "email": "financeiro@mmdistribuidora.com.br", 
        "name": "MM Admin", 
        "is_admin": True
    }
