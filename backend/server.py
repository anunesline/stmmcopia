from fastapi import FastAPI
# ... (seus imports)

app = FastAPI()

# ... (seu middleware CORS)

@app.get("/api/auth/me")
async def get_me():
    return {"email": "admin@mm.com", "name": "MM Admin", "is_admin": True}

@app.get("/api/settings")
async def get_settings():
    return {"whatsapp_number": "554134032999"}

# ... (restante das suas rotas)
