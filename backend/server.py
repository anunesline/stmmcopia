from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

# URL correta
MONGO_URL = "mongodb+srv://saturnlabs_db_user:t7UmdDNnJBA0UdR0@cluster0.mugiyqh.mongodb.net/?retryWrites=true&w=majority"

# Conexão forçada ao banco 'saturnlabs'
client = AsyncIOMotorClient(MONGO_URL)
db = client['saturnlabs'] 

app = FastAPI()

@app.get("/api/test")
async def root():
    return {"message": "API rodando com sucesso"}
@app.get("/api/products")
async def get_products():
    # Buscando todos os produtos do banco 'saturnlabs'
    products = await db.products.find().to_list(length=100)
    # Convertendo o ID do MongoDB para string para o Frontend entender
    for p in products:
        p["product_id"] = str(p.pop("_id"))
    return products

@app.get("/api/categories")
async def get_categories():
    categories = await db.categories.find().to_list(length=100)
    for c in categories:
        c["category_id"] = str(c.pop("_id"))
    return categories
