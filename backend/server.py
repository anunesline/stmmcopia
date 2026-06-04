from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from bson import ObjectId

# 1. Configurações iniciais
load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME')]

app = FastAPI()

# 2. Configuração de segurança
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. ROTAS (Onde a mágica acontece)

@app.post("/api/auth/login")
async def login(data: dict):
    return {
        "session_token": "token-valido-123",
        "user": {"email": data.get("email"), "name": "Admin", "is_admin": True}
    }

@app.get("/api/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "MM Admin", "is_admin": True}

@app.get("/api/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

@app.post("/api/admin/upload")
async def upload(file: UploadFile = File(...)):
    return {"url": "https://via.placeholder.com/150"}

@app.post("/api/admin/products")
async def create_product(data: dict):
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}
