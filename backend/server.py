from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criamos um roteador com prefixo /api
api_router = APIRouter(prefix="/api")

@api_router.get("/settings")
async def get_settings():
    return {"whatsapp_number": "554134032999"}

@api_router.get("/auth/me")
async def get_me():
    return {"email": "financeiro@mmdistribuidora.com.br", "name": "Admin", "is_admin": True}

@api_router.get("/categories")
async def get_categories():
    return [] # Retornando vazio para testar se o erro 404 some

@api_router.get("/products")
async def get_products():
    return []

@api_router.post("/auth/login")
async def login(data: dict):
    return {"session_token": "token-123", "user": {"email": "admin@mm.com", "name": "Admin", "is_admin": True}}

# Incluímos o roteador no app principal
app.include_router(api_router)
@api_router.get("/debug/databases")
async def debug_db():
    # Isso lista todos os bancos de dados no seu cluster
    dblist = await client.list_database_names()
    return {"bancos_encontrados": dblist}
