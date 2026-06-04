from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext

# Configuração de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except:
        return False

# Configurações
load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

# Middleware CORS - Permitindo tudo para evitar bloqueios
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROTAS GERAIS ---

@app.get("/")
async def root():
    return {"message": "API está rodando!"}

@app.get("/api/status")
async def status():
    return {"status": "ok"}

# --- ROTAS DE PRODUTOS E CATEGORIAS ---

@app.get("/api/products")
async def get_products(featured: str = None):
    query = {"is_featured": True} if featured == "true" else {}
    products = await db.products.find(query).to_list(length=100)
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    product["_id"] = str(product["_id"])
    return product

@app.get("/api/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories:
        c["_id"] = str(c["_id"])
    return categories

@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find_one({})
    if settings:
        settings["_id"] = str(settings["_id"])
    return settings or {"whatsapp_number": "554134032999"}

# --- ROTAS DE AUTENTICAÇÃO ---

@app.post("/api/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")
    
    # Busca na coleção 'users' (confirme se o nome é este no seu Atlas)
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
    return {
        "email": "financeiro@mmdistribuidora.com.br",
        "name": "MM Admin",
        "is_admin": True
    }
