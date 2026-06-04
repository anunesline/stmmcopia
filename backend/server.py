from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# Configuração de Banco
MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client['test']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# CRIAÇÃO DO ROTEADOR (O que estava faltando antes)
api_router = APIRouter(prefix="/api")

@api_router.get("/debug/all-dbs")
async def debug_all_dbs():
    dbs = await client.list_database_names()
    return {"bancos_encontrados": dbs}

@api_router.get("/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

# Registro final das rotas
app.include_router(api_router)
