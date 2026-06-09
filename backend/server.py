import os
import logging
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict, Any
from bson import ObjectId

# ==================== LOG ====================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== CLOUDINARY ====================
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

# ==================== DATABASE ====================
MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb+srv://saturnlabs_db_user:21062018@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
)

client = AsyncIOMotorClient(MONGO_URL)
db = client["meuapp_dev"]

# ==================== APP ====================
app = FastAPI(title="STMM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://www.mmdistribuidora.com.br",
        "https://mmdistribuidora.com.br",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter()


# ==================== HELPERS ====================
def serialize_product(p: Dict[str, Any]):
    p["id"] = str(p["_id"])
    p.pop("_id", None)
    return p


def serialize_category(c: Dict[str, Any]):
    c["id"] = str(c["_id"])
    c.pop("_id", None)
    return c


def safe_object_id(id_str: str):
    try:
        return ObjectId(id_str)
    except:
        return None


# ==================== UPLOAD ====================
@api.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        result = cloudinary.uploader.upload(file.file)
        return {"url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PRODUCTS ====================
@api.get("/products")
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}

    if category:
        query["category"] = category

    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    products = await db.products.find(query).to_list(200)

    logger.info(f"GET /products -> {len(products)} items")

    return [serialize_product(p) for p in products]


@api.get("/products/featured")
async def get_featured():
    products = await db.products.find({"is_featured": True}).to_list(50)
    return [serialize_product(p) for p in products]


@api.post("/products")
async def create_product(data: dict):
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}


@api.put("/products/{product_id}")
async def update_product(product_id: str, data: dict):
    obj_id = safe_object_id(product_id)

    if not obj_id:
        raise HTTPException(status_code=400, detail="ID inválido")

    result = await db.products.update_one(
        {"_id": obj_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    return {"message": "updated"}


@api.delete("/products/{product_id}")
async def delete_product(product_id: str):
    obj_id = safe_object_id(product_id)

    if not obj_id:
        raise HTTPException(status_code=400, detail="ID inválido")

    result = await db.products.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    return {"message": "deleted"}


# ==================== CATEGORIES ====================
@api.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(100)
    return [serialize_category(c) for c in categories]


# ==================== AUTH ====================
@api.post("/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email e senha são obrigatórios")

    user = await db.users.find_one({"email": email})

    if not user or user.get("password") != password:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    return {
        "token": "fake-token",
        "user": {
            "email": email,
            "is_admin": True
        }
    }


# ==================== SETTINGS ====================
@api.get("/settings")
async def get_settings():
    return {
        "whatsapp_number": os.getenv("WHATSAPP_NUMBER", "554134032999"),
        "site_name": "STMM",
    }


# ==================== DEBUG (ESSENCIAL AGORA) ====================
@api.get("/debug-db")
async def debug_db():
    count = await db.products.count_documents({})
    return {
        "database": "meuapp_dev",
        "products_count": count
    }


# ==================== SEED ====================
@api.post("/auth/seed")
async def seed():
    await db.users.insert_one({
        "email": "teste@teste.com",
        "password": "123456",
        "is_admin": True
    })
    return {"ok": True}


# ==================== ROUTER ====================
app.include_router(api, prefix="/api")


# ==================== ROOT ====================
@app.get("/")
def root():
    return {"status": "STMM API running"}