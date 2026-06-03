from fastapi import FastAPI, APIRouter, HTTPException, Response, Depends, Header, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, urllib.parse, uuid
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

# Imports locais (mantenha os seus arquivos storage.py e auth.py na mesma pasta)
from storage import init_storage, put_object, get_object, APP_NAME
from auth import create_token, decode_token, verify_password, seed_admin

# 1. Configurações Iniciais
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# 2. Instâncias Principais
app = FastAPI()
api_router = APIRouter(prefix="/api")

# 3. Middleware de CORS (Agressivo)
# --- ROTAS CORRIGIDAS ---

@api_router.get("/status")
async def status():
    return {"status": "ok"}

@api_router.get("/products")
async def get_products():
    # Busca todos os produtos no banco 'db' (já definido no início do arquivo)
    products = await db.products.find().to_list(length=100)
    # Converte o ID do Mongo para string para o JSON aceitar
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    from bson import ObjectId
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    product["_id"] = str(product["_id"])
    return product

@api_router.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories:
        c["_id"] = str(c["_id"])
    return categories

@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({})
    if settings:
        settings["_id"] = str(settings["_id"])
    return settings or {"whatsapp_number": "554134032999"} # Retorna um padrão se não achar

# 4. Inclusão do Router (APÓS as rotas estarem definidas)
app.include_router(api_router)

# 5. Eventos de Inicialização
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await seed_admin(db)
    try:
        init_storage()
    except Exception as e:
        logging.warning(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
