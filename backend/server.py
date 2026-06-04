from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
# Conecte-se usando a URL do ambiente
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client.get_database() # Pega o banco definido na connection string

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
async def test():
    return {"status": "A API ESTÁ FUNCIONANDO"}

@app.get("/api/products")
async def get_products():
    # Tenta listar coleções para verificar conexão
    try:
        collections = await db.list_collection_names()
        products = await db.products.find().to_list(length=100)
        return {"collections": collections, "products": products}
    except Exception as e:
        return {"error": str(e)}
