import os
import logging
from fastapi import FastAPI, APIRouter, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# Configuração de Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== DATABASE ====================
# Certifique-se de que a variável de ambiente MONGO_URL esteja configurada no Render
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority")
client = AsyncIOMotorClient(MONGO_URL)
db = client['test']

# ==================== FASTAPI APP ====================
app = FastAPI(title="STMM API")

# CORREÇÃO: Middleware de CORS liberando a Vercel e o localhost para desenvolvimento
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, substitua por: ["https://seu-site-na-vercel.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Roteador com prefixo /api
# Quando você faz api.get("/products"), a rota final é /api/products
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

@api.post("/admin/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"message": "Upload recebido", "filename": file.filename}

# IMPORTANTE: Incluir o router após definir todas as rotas
app.include_router(api)

# Rota de teste na raiz para evitar o {"detail":"Not Found"} ao acessar o IP direto
@app.get("/")
def read_root():
    return {"status": "STMM API is running", "docs": "/docs"}
