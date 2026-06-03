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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AQUI VOCÊ COLA TODAS AS SUAS ROTAS (Models, Auth, Catalog, Admin, etc) ---
# [ Cole aqui as suas classes Pydantic e as funções @api_router.get / @api_router.post ]
# Exemplo básico:
@api_router.get("/status")
async def status():
    return {"status": "ok"}

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
