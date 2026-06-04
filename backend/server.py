import os
import logging
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from auth import verify_password, create_token, seed_admin

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="STMM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# Conexão com Banco de Dados usando lifespan (método moderno e recomendado)
@app.on_event("startup")
async def startup_event():
    mongo_url = os.getenv("MONGO_URL")
    if not mongo_url:
        logger.error("ERRO: Variável MONGO_URL não encontrada no Render!")
        return

    try:
        app.mongodb_client = AsyncIOMotorClient(mongo_url)
        app.db = app.mongodb_client['test']
        
        # Seeders
        await seed_admin(app.db)
        await seed_initial_data(app.db)
        logger.info("Conexão MongoDB estabelecida e seeds carregados.")
    except Exception as e:
        logger.error(f"Erro ao conectar ao MongoDB: {e}")

async def seed_initial_data(db):
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many([
            {"name": "Eletrônicos", "slug": "eletronicos"},
            {"name": "Acessórios", "slug": "acessorios"},
        ])
    
    if await db.products.count_documents({}) == 0:
        await db.products.insert_one({
            "name": "Produto de Teste",
            "slug": "produto-teste",
            "price": 10.0
        })

@api.get("/products")
async def get_products():
    cursor = app.db.products.find({})
    products = await cursor.to_list(length=100)
    for p in products:
        p["product_id"] = str(p.pop("_id"))
    return products

@api.get("/categories")
async def get_categories():
    cursor = app.db.categories.find({})
    categories = await cursor.to_list(length=100)
    for c in categories:
        c["category_id"] = str(c.pop("_id"))
    return categories

@api.get("/settings")
async def get_settings():
    # Se você ainda não tem uma coleção de configurações, 
    # retorne apenas um JSON vazio ou inicial
    return {"site_name": "STMM", "status": "online"}

@api.post("/auth/login")
async def login(data: dict):
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    
    user = await app.db.users.find_one({"email": email})
    if not user or not verify_password(password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    token = create_token(str(user["_id"]), user["email"])
    return {"session_token": token, "user": {"email": user["email"]}}

app.include_router(api)
