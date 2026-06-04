from fastapi import FastAPI, APIRouter, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Conexão com o banco
MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client['test']

app = FastAPI()

# Configuração de CORS blindada
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

api_router = APIRouter(prefix="/api")

@api_router.get("/products")
async def get_products():
    products = await db.products.find().to_list(length=100)
    for p in products: p["product_id"] = str(p.pop("_id"))
    return products

# ... (Mantenha as outras rotas aqui dentro do api_router)

app.include_router(api_router)
