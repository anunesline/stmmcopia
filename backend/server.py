import os
import logging
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
# Importação corrigida (sem o ponto)
from auth import verify_password, create_token, seed_admin

logger = logging.getLogger(__name__)

app = FastAPI(title="STMM API")

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# Conexão com Banco de Dados dentro do startup
@app.on_event("startup")
async def startup():
    # Pega a URL do painel do Render ou usa a padrão como fallback
mongo_url = os.getenv("MONGO_URL")
if not mongo_url:
    raise ValueError("A variável MONGO_URL não está configurada no Render!")

    app.mongodb_client = AsyncIOMotorClient(mongo_url)
    app.db = app.mongodb_client['test']
    
    # Executa os seeds
    await seed_admin(app.db)
    await seed_initial_data(app.db)
    logger.info("Conexão com MongoDB estabelecida e dados inicializados.")

async def seed_initial_data(db):
    """Seed de categorias e produtos iniciais"""
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many([
            {"name": "Eletrônicos", "slug": "eletronicos", "description": "Produtos eletrônicos diversos"},
            {"name": "Acessórios", "slug": "acessorios", "description": "Acessórios e complementos"},
            {"name": "Vestuário", "slug": "vestuario", "description": "Roupas e vestuário"},
        ])
    
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many([
            {
                "name": "Produto Exemplo 1",
                "slug": "produto-exemplo-1",
                "category": "eletronicos",
                "price": 99.90,
                "image": "https://via.placeholder.com/300?text=Produto+1",
                "description": "Este é um produto de exemplo",
            },
        ])

# Rotas
@api.get("/products")
async def get_products():
    products = await app.db.products.find().to_list(length=100)
    for p in products:
        p["product_id"] = str(p.pop("_id"))
    return products

@api.get("/categories")
async def get_categories():
    categories = await app.db.categories.find().to_list(length=100)
    for c in categories:
        c["category_id"] = str(c.pop("_id"))
    return categories

@api.post("/auth/login")
async def login(data: dict):
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    
    user = await app.db.users.find_one({"email": email})
    if not user or not verify_password(password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    token = create_token(str(user["_id"]), user["email"])
    return {"session_token": token, "user": {"email": user["email"], "name": user.get("name")}}

app.include_router(api)
