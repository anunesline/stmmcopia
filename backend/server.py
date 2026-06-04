from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import APIRouter

# Configuração de Banco
MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client['saturnlabs']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criando um roteador que coloca /api em tudo
api_router = APIRouter(prefix="/api")

@api_router.get("/settings")
async def get_settings():
    return {"whatsapp_number": "554134032999"}

@api_router.get("/products")
async def get_products():
    # LISTAR TODAS AS COLEÇÕES DO BANCO
    colecoes = await db.list_collection_names()
    print(f"DEBUG: Coleções existentes no banco 'saturnlabs': {colecoes}")
    
    products = await db.products.find().to_list(length=100)
    print(f"DEBUG: Encontrei {len(products)} produtos na coleção 'products'")
    
    for p in products: 
        p["product_id"] = str(p.pop("_id"))
    return products

@api_router.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories: c["category_id"] = str(c.pop("_id"))
    return categories

@api_router.post("/auth/login")
async def login(data: dict):
    return {"session_token": "token-123", "user": {"email": data.get("email"), "name": "Admin", "is_admin": True}}

@api_router.get("/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "Admin", "is_admin": True}

# Registrando o roteador no app
app.include_router(api_router)
