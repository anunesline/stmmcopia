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
api_router = APIRouter() # Removi o prefixo aqui para testar sem ele

# 3. Middleware de CORS (Configuração mais rigorosa para o seu domínio)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.mmdistribuidora.com.br", 
        "https://mmdistribuidora.com.br",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Inclusão do Router
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
