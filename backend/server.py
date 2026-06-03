from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
from dotenv import load_dotenv

# Configurações
load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

# Middleware CORS (Permitindo seu domínio)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.mmdistribuidora.com.br", "https://mmdistribuidora.com.br"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas diretas no app (sem router para evitar erro de prefixo)

@app.get("/api/status")
async def status():
    return {"status": "ok"}

@app.get("/api/products")
async def get_products(featured: str = None):
    # Alterado de "featured" para "is_featured" para coincidir com seu banco de dados
    query = {"is_featured": True} if featured == "true" else {}
    products = await db.products.find(query).to_list(length=100)
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    product["_id"] = str(product["_id"])
    return product

@app.get("/api/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories:
        c["_id"] = str(c["_id"])
    return categories

@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find_one({})
    if settings:
        settings["_id"] = str(settings["_id"])
    return settings or {"whatsapp_number": "554134032999"}
