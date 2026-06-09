import os
import logging
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pymongo import ReturnDocument  # 🔥 FIX IMPORT

logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
JWT_TTL_DAYS = 7

# ==================== AUTH ====================
def _secret():
    return os.environ.get("JWT_SECRET", "secreto-123-change-me")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except:
        return False

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)

# ==================== DB ====================
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client["test"]

# ==================== APP ====================
app = FastAPI(title="STMM API")

# 🔥 CORS FIX (sem conflito)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# ==================== HELPERS ====================
def serialize_product(p):
    return {
        "product_id": str(p["_id"]),
        "name": p.get("name"),
        "description": p.get("description"),
        "price": p.get("price"),
        "category": p.get("category"),
        "image": p.get("image"),
    }

# ==================== PRODUCTS ====================
@api.get("/products")
async def get_products():
    products = await db.products.find().to_list(200)
    return [serialize_product(p) for p in products]


@api.post("/products")
async def create_product(data: dict):
    new = {
        "name": data.get("name"),
        "description": data.get("description"),
        "price": data.get("price"),
        "category": data.get("category", "geral"),
        "image": data.get("image", ""),
        "created_at": datetime.now(timezone.utc),
    }

    res = await db.products.insert_one(new)
    new["_id"] = res.inserted_id

    return serialize_product(new)


@api.put("/products/{product_id}")
async def update_product(product_id: str, data: dict):
    try:
        obj_id = ObjectId(product_id)
    except:
        raise HTTPException(status_code=400, detail="ID inválido")

    updated = await db.products.find_one_and_update(
        {"_id": obj_id},
        {"$set": {
            "name": data.get("name"),
            "description": data.get("description"),
            "price": data.get("price"),
            "category": data.get("category"),
            "image": data.get("image"),
        }},
        return_document=ReturnDocument.AFTER  # 🔥 FIX REAL
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    return serialize_product(updated)


@api.delete("/products/{product_id}")
async def delete_product(product_id: str):
    try:
        obj_id = ObjectId(product_id)
    except:
        raise HTTPException(status_code=400, detail="ID inválido")

    await db.products.delete_one({"_id": obj_id})
    return {"message": "deleted"}

# ==================== CATEGORIES ====================
@api.get("/categories")
async def get_categories():
    cats = await db.categories.find().to_list(100)
    return [
        {"category_id": str(c["_id"]), "name": c["name"], "slug": c.get("slug")}
        for c in cats
    ]

# ==================== SETTINGS ====================
@api.get("/settings")
async def settings():
    return {
        "whatsapp_number": os.getenv("WHATSAPP_NUMBER", "554134032999"),
        "site_name": "STMM"
    }

# ==================== AUTH ====================
@api.post("/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    user = await db.users.find_one({"email": email})

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Login inválido")

    token = create_token(str(user["_id"]), email)

    return {
        "token": token,
        "user": {
            "email": email,
            "is_admin": user.get("is_admin", False)
        }
    }

# ==================== ROUTER ====================
app.include_router(api)

# ==================== ROOT ====================
@app.get("/")
def root():
    return {"status": "API ON"}