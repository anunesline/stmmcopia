import os
import logging
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)
JWT_ALGORITHM = "HS256"
JWT_TTL_DAYS = 7

# ==================== AUTH FUNCTIONS ====================
def _secret():
    return os.environ.get("JWT_SECRET", "secreto-123-change-me")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)

async def seed_admin(db):
    email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    password = os.environ.get("ADMIN_PASSWORD", "")
    if not email or not password:
        logger.warning("ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping seed")
        return
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "user_id": "user_admin_001",
            "email": email,
            "name": "MM Admin",
            "password_hash": hash_password(password),
            "is_admin": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {email}")
    elif not verify_password(password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": hash_password(password), "is_admin": True}},
        )
        logger.info(f"Admin password updated: {email}")

# ==================== DATABASE ====================
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority")
client = AsyncIOMotorClient(MONGO_URL)
db = client['test']

# ==================== FASTAPI APP ====================
app = FastAPI(title="STMM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# ==================== STARTUP ====================
@app.on_event("startup")
async def startup():
    await seed_admin(db)
    await seed_initial_data()

async def seed_initial_data():
    """Seed de categorias e produtos iniciais"""
    # Verificar e criar categorias
    categories_count = await db.categories.count_documents({})
    if categories_count == 0:
        await db.categories.insert_many([
            {"name": "Eletrônicos", "slug": "eletronicos", "description": "Produtos eletrônicos diversos"},
            {"name": "Acessórios", "slug": "acessorios", "description": "Acessórios e complementos"},
            {"name": "Vestuário", "slug": "vestuario", "description": "Roupas e vestuário"},
        ])
        logger.info("Categorias criadas com sucesso")
    
    # Verificar e criar produtos
    products_count = await db.products.count_documents({})
    if products_count == 0:
        await db.products.insert_many([
            {
                "name": "Produto Exemplo 1",
                "slug": "produto-exemplo-1",
                "category": "eletronicos",
                "price": 99.90,
                "image": "https://via.placeholder.com/300?text=Produto+1",
                "description": "Este é um produto de exemplo",
            },
            {
                "name": "Produto Exemplo 2",
                "slug": "produto-exemplo-2",
                "category": "acessorios",
                "price": 49.90,
                "image": "https://via.placeholder.com/300?text=Produto+2",
                "description": "Este é outro produto de exemplo",
            },
        ])
        logger.info("Produtos criados com sucesso")

# ==================== ROUTES ====================
@api.get("/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products:
        p["product_id"] = str(p.pop("_id"))
    return products

@api.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories:
        c["category_id"] = str(c.pop("_id"))
    return categories

@api.get("/settings")
async def get_settings():
    """Retorna configurações gerais"""
    return {
        "whatsapp_number": os.getenv("WHATSAPP_NUMBER", "554134032999"),
        "site_name": "STMM",
    }

@api.post("/auth/login")
async def login(data: dict):
    """Login com email e senha"""
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email e senha são obrigatórios")
    
    user = await db.users.find_one({"email": email})
    
    if not user:
        logger.warning(f"Login attempt with non-existent email: {email}")
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    if not verify_password(password, user.get("password_hash", "")):
        logger.warning(f"Failed login attempt for: {email}")
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    token = create_token(user["user_id"], user["email"])
    
    return {
        "session_token": token,
        "user": {
            "email": user["email"],
            "name": user.get("name", "Usuario"),
            "is_admin": user.get("is_admin", False)
        }
    }

@api.get("/auth/me")
async def get_me(token: str = None):
    """Retorna dados do usuário autenticado (placeholder)"""
    return {
        "email": "admin@mm.com",
        "name": "Admin",
        "is_admin": True
    }

@api.post("/admin/upload")
async def upload_file(file: UploadFile = File(...)):
    """Endpoint para upload de arquivos"""
    return {
        "message": "Upload recebido",
        "filename": file.filename,
        "size": file.size,
    }

app.include_router(api)
