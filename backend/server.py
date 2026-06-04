from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# ROTAS PÚBLICAS
@app.get("/")
async def root(): return {"message": "API OK"}

@app.get("/api/products")
async def get_products(featured: str = None):
    query = {"is_featured": True} if featured == "true" else {}
    products = await db.products.find(query).to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

@app.get("/api/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories: c["category_id"] = str(c.pop("_id"))
    return categories

@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find_one({})
    if settings: settings["_id"] = str(settings["_id"])
    return settings or {"whatsapp_number": "554134032999"}

# ROTAS ADMIN E UPLOAD
@app.post("/api/admin/upload")
async def upload(file: UploadFile = File(...)):
    # Retorna um placeholder para não dar erro 404. 
    # Use um serviço de upload real aqui se precisar persistir a imagem.
    return {"url": f"https://via.placeholder.com/150/0B2861/ffffff?text=IMG"}

@app.post("/api/admin/products")
async def create_product(data: dict):
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}

@app.put("/api/admin/products/{id}")
async def update_product(id: str, data: dict):
    data.pop("product_id", None)
    await db.products.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"status": "ok"}

@app.delete("/api/admin/products/{id}")
async def delete_product(id: str):
    await db.products.delete_one({"_id": ObjectId(id)})
    return {"status": "ok"}

# ROTAS AUTH
@app.post("/api/auth/login")
async def login(data: dict):
    email = data.get("email")
    user = await db.users.find_one({"email": email})
    if not user: raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return {"session_token": "token-123", "user": {"email": user.get("email"), "name": "Admin", "is_admin": True}}
@app.get("/api/auth/me")
async def get_me():
    # Esta rota deve retornar os dados do usuário autenticado.
    # Se você ainda não tem um sistema de tokens completo, 
    # este retorno "chumbado" serve para o painel admin carregar.
    return {
        "email": "admin@mm.com", 
        "name": "MM Admin", 
        "is_admin": True
    }
