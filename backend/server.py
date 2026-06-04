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

# ==================== DATABASE ====================
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority")
client = AsyncIOMotorClient(MONGO_URL)
db = client['test']

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

# ==================== ROUTES ====================

@api.get("/products")
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
        
    products = await db.products.find(query).to_list(length=100)
    for p in products:
        p["product_id"] = str(p.pop("_id"))
    return products

@api.get("/products/featured")
async def get_featured_products():
    """Rota específica para a Home: retorna apenas 5 produtos destacados"""
    # Filtra por is_featured=True e limita a 5 itens
    products = await db.products.find({"is_featured": True}).limit(5).to_list(length=5)
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

# Rota para upload simples (mantida)
@api.post("/admin/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"message": "Upload recebido", "filename": file.filename}

app.include_router(api)
