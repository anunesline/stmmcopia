from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client['test'] # O banco que confirmamos que tem dados

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# Rota que o painel usa para configurações gerais
@api_router.get("/settings")
async def get_settings():
    return {"whatsapp_number": "554134032999"} # Exemplo

# Rotas de Produtos e Categorias
@api_router.get("/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

@api_router.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories: c["category_id"] = str(c.pop("_id"))
    return categories

# Rotas de Login e Autenticação
@api_router.post("/auth/login")
async def login(data: dict):
    # O frontend espera 'session_token' e um objeto 'user' com 'is_admin'
    return {
        "session_token": "token-123", 
        "user": {
            "email": data.get("email"), 
            "name": "Admin", 
            "is_admin": True  # Isso força a liberação do acesso
        }
    }

@api_router.get("/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "Admin"}

app.include_router(api_router)
