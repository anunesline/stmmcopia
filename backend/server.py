from fastapi import FastAPI, APIRouter, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Configuração de Banco
MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client['test']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.mmdistribuidora.com.br"], # Permissão explícita para o seu domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# Rotas de Configuração e Info
@api_router.get("/settings")
async def get_settings():
    return {"whatsapp_number": "554134032999"}

# Rotas de Produtos (Listar, Editar, Deletar)
@api_router.get("/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: dict):
    data.pop("product_id", None)
    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": data})
    return {"message": "Produto atualizado com sucesso"}

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    await db.products.delete_one({"_id": ObjectId(product_id)})
    return {"message": "Produto removido"}

@api_router.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories: c["category_id"] = str(c.pop("_id"))
    return categories

# Autenticação
@api_router.post("/auth/login")
async def login(data: dict):
    return {
        "session_token": "token-123", 
        "user": {"email": data.get("email"), "name": "Admin", "is_admin": True}
    }

@api_router.get("/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "Admin", "is_admin": True}

# Upload
@api_router.post("/admin/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename, "message": "Upload recebido com sucesso"}

app.include_router(api_router)
