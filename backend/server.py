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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# Rotas - Todas unificadas
@api.get("/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

@api.get("/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories: c["category_id"] = str(c.pop("_id"))
    return categories

@api.post("/auth/login")
async def login(data: dict):
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    token = create_token(user["user_id"], user["email"])
    return {
        "session_token": token,
        "user": {
            "email": user["email"],
            "name": user["name"],
            "is_admin": user["is_admin"]
        }
    }

@api.get("/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "Admin", "is_admin": True}

@api.post("/admin/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"message": "Upload recebido"}

app.include_router(api)

@app.on_event("startup")
async def startup():
    await seed_products()

async def seed_products():
    count = await db.products.count_documents({})
    if count == 0:
        await db.products.insert_many([
            {
                "name": "Produto 1",
                "slug": "produto-1",
                "category": "categoria-1",
                "price": 99.90,
                "image": "https://example.com/image1.jpg",
                "description": "Descrição do produto"
            }
        ])
