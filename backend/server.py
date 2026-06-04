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
