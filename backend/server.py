import os
import logging
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# Configuração de Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
JWT_TTL_DAYS = 7

# ==================== AUTH FUNCTIONS ====================
def _secret():
    return os.environ.get("JWT_SECRET", "secreto-123-change-me")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)

# ==================== DATABASE ====================
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority")
client = AsyncIOMotorClient(MONGO_URL)
db = client['test'] # Certifique-se de que este é o nome correto do seu banco

# ==================== FASTAPI APP ====================
app = FastAPI(title="STMM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# ==================== STARTUP ====================
async def seed_initial_data():
    # ... (seu código de seed anterior continua aqui)
    pass

@app.on_event("startup")
async def startup():
    # await seed_admin(db) # Descomente se precisar
    await seed_initial_data()

# ==================== ROUTES CORRIGIDAS ====================

@api.get("/products")
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    """Rota corrigida: filtra por categoria se fornecida"""
    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
        
    products = await db.products.find(query).to_list(length=100)
    for p in products:
        p["product_id"] = str(p.pop("_id"))
    return products

@api.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories:
        c["category_id"] = str(c.pop("_id"))
    return categories

@api.get("/settings")
async def get_settings():
    return {
        "whatsapp_number": os.getenv("WHATSAPP_NUMBER", "554134032999"),
        "site_name": "STMM",
    }

# (Resto das suas rotas de auth e upload permanecem aqui)

app.include_router(api)
