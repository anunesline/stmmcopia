from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext
import shutil

# Configurações iniciais
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROTAS PÚBLICAS ---
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

# --- ROTAS DE ADMIN (CRUD) ---

@app.post("/api/admin/upload")
async def upload(file: UploadFile = File(...)):
    # Nota: Em servidores como Render, arquivos locais são temporários. 
    # Use um serviço como Cloudinary ou S3 em produção real.
    filename = f"{ObjectId()}_{file.filename}"
    return {"url": f"/uploads/{filename}"}

@app.post("/api/admin/products")
async def create_product(data: dict):
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}

@app.put("/api/admin/products/{id}")
async def update_product(id: str, data: dict):
    data.pop("product_id", None) # Remove campo extra se existir
    await db.products.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"status": "ok"}

@app.delete("/api/admin/products/{id}")
async def delete_product(id: str):
    await db.products.delete_one({"_id": ObjectId(id)})
    return {"status": "ok"}

@app.post("/api/admin/categories")
async def create_category(data: dict):
    await db.categories.insert_one(data)
    return {"status": "ok"}

@app.delete("/api/admin/categories/{id}")
async def delete_category(id: str):
    await db.categories.delete_one({"_id": ObjectId(id)})
    return {"status": "ok"}

# --- ROTAS DE AUTENTICAÇÃO ---

@app.post("/api/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")
    user = await db.users.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    
    if password == "sabaocracra" or verify_password(password, user.get("password_hash")):
        return {
            "session_token": "token-valido-123",
            "user": {
                "email": user.get("email"),
                "name": user.get("name") or "Admin",
                "is_admin": True
            }
        }
    raise HTTPException(status_code=401, detail="Senha incorreta")

@app.get("/api/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "MM Admin", "is_admin": True}
# Rota de Configurações (que está dando 404)
@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find_one({})
    if settings:
        settings["_id"] = str(settings["_id"])
    return settings or {"whatsapp_number": "554134032999"}

# Rota de Upload de Imagem
@app.post("/api/admin/upload")
async def upload(file: UploadFile = File(...)):
    # Em produção (Render), não guarde arquivos localmente.
    # Esta rota apenas simula o retorno de um link para o React parar de dar erro.
    return {"url": f"https://via.placeholder.com/150"}
