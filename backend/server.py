from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- ROTAS DE AUTH E CONFIG ---
@app.get("/api/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "MM Admin", "is_admin": True}

@app.get("/api/settings")
async def get_settings():
    return {"whatsapp_number": "554134032999"}

# --- ROTAS DE ADMIN ---
@app.post("/api/admin/upload")
async def upload(file: UploadFile = File(...)):
    # Retorna uma URL fixa para evitar erro 404 de arquivos inexistentes no servidor
    return {"url": "https://via.placeholder.com/150/0B2861/ffffff?text=IMG"}

@app.post("/api/admin/products")
async def create_product(data: dict):
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}

@app.put("/api/admin/products/{id}")
async def update_product(id: str, data: dict):
    data.pop("product_id", None)
    await db.products.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"status": "ok"}

# --- ROTAS PÚBLICAS ---
@app.get("/api/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

@app.get("/api/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories: c["category_id"] = str(c.pop("_id"))
    return categories
