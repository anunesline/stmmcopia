from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, urllib.parse
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ Models ============

class ChatMessage(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    message: str
    product: Optional[str] = None

# ============ Catalog ============

@api_router.get("/categories")
async def list_categories():
    items = await db.categories.find({}, {"_id": 0}).to_list(100)
    return items

@api_router.get("/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None,
                        search: Optional[str] = None, limit: int = 60):
    q = {}
    if category:
        q["category"] = category
    if featured is not None:
        q["is_featured"] = featured
    if search:
        q["name"] = {"$regex": search, "$options": "i"}
    items = await db.products.find(q, {"_id": 0}).limit(limit).to_list(limit)
    return items

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    doc = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc

# ============ Settings ============

@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"key": "global"}, {"_id": 0})
    if not doc:
        return {"whatsapp_number": "554134032999"}
    return {"whatsapp_number": doc.get("whatsapp_number", "554134032999")}

# ============ WhatsApp ============

@api_router.post("/chat/whatsapp")
async def chat_whatsapp(payload: ChatMessage):
    settings_doc = await db.settings.find_one({"key": "global"}, {"_id": 0}) or {}
    number = settings_doc.get("whatsapp_number", "554134032999")
    doc = {
        "message_id": f"msg_{uuid.uuid4().hex[:10]}",
        "name": payload.name,
        "phone": payload.phone,
        "message": payload.message,
        "product": payload.product,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.chat_messages.insert_one(dict(doc))
    parts = []
    if payload.name:
        parts.append(f"Oi! Meu nome é {payload.name}.")
    if payload.product:
        parts.append(f"Tenho interesse no produto: {payload.product}.")
    parts.append(payload.message)
    if payload.phone:
        parts.append(f"Telefone: {payload.phone}")
    full = "\n".join(parts)
    url = f"https://wa.me/{number}?text={urllib.parse.quote(full)}"
    return {"whatsapp_url": url, "number": number}

# ============ Seed Data ============

async def seed_data():
    if not await db.settings.find_one({"key": "global"}):
        await db.settings.insert_one({
            "key": "global",
            "whatsapp_number": "554134032999",
        })
    else:
        await db.settings.update_one(
            {"key": "global"},
            {"$set": {"whatsapp_number": "554134032999"}},
        )

    categories = [
        {"category_id": "cat_limpeza", "name": "Limpeza Geral", "slug": "limpeza-geral", "icon": "Sparkles"},
        {"category_id": "cat_descartaveis", "name": "Descartáveis", "slug": "descartaveis", "icon": "Package"},
        {"category_id": "cat_papeis", "name": "Papéis", "slug": "papeis", "icon": "FileText"},
        {"category_id": "cat_higiene", "name": "Higiene", "slug": "higiene", "icon": "Droplets"},
    ]
    for c in categories:
        await db.categories.update_one({"category_id": c["category_id"]}, {"$set": c}, upsert=True)
    # Remove obsolete categories
    valid_ids = [c["category_id"] for c in categories]
    await db.categories.delete_many({"category_id": {"$nin": valid_ids}})

    # Reset products to Azulim line + complements
    await db.products.delete_many({})

    azulim_perfumado = "https://images.unsplash.com/photo-1585421514738-01798e348b17?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
    azulim_vidros = "https://images.unsplash.com/photo-1563453392212-326f5e854473?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
    azulim_multi = "https://images.unsplash.com/photo-1583947215259-38e31be8751f?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
    azulim_desinf = "https://images.unsplash.com/photo-1626379481874-3dc5678fa8ca?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
    azulim_louca = "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
    descart_img = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
    papel_img = "https://images.unsplash.com/photo-1563456102060-9c0dfc1f4b3a?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"

    products = [
        {"name": "Azulim Limpador Perfumado", "category": "limpeza-geral", "image": azulim_perfumado, "is_featured": True,
         "description": "Limpador perfumado Azulim — fragrância marcante e ação prolongada. Ideal para pisos, superfícies e ambientes."},
        {"name": "Azulim Limpa Vidros", "category": "limpeza-geral", "image": azulim_vidros, "is_featured": True,
         "description": "Limpa vidros Azulim — alto brilho, sem manchas, evapora rapidamente."},
        {"name": "Azulim Multiuso", "category": "limpeza-geral", "image": azulim_multi, "is_featured": True,
         "description": "Multiuso Azulim — limpa, desengordura e perfuma diversas superfícies."},
        {"name": "Azulim Desinfetante Super Concentrado", "category": "higiene", "image": azulim_desinf, "is_featured": True,
         "description": "Desinfetante super concentrado Azulim — ação bactericida prolongada, rendimento superior."},
        {"name": "Azulim Lava Louças", "category": "limpeza-geral", "image": azulim_louca, "is_featured": True,
         "description": "Lava-louças Azulim — alta concentração, espuma rica e perfume agradável."},
        {"name": "Saco de Lixo Reforçado 100L", "category": "descartaveis", "image": descart_img,
         "description": "Saco de lixo reforçado, alta resistência, embalagem com 100 unidades."},
        {"name": "Luva Descartável Nitrílica", "category": "descartaveis", "image": descart_img,
         "description": "Luva nitrílica descartável sem pó, caixa com 100 unidades."},
        {"name": "Papel Toalha Interfolhado", "category": "papeis", "image": papel_img,
         "description": "Papel toalha interfolhado branco luxo, fardo com 1000 folhas."},
        {"name": "Papel Higiênico Profissional 300m", "category": "papeis", "image": papel_img,
         "description": "Papel higiênico folha dupla 300m, ideal para uso comercial."},
    ]
    for i, p in enumerate(products):
        doc = {
            "product_id": f"prod_{i+1:03d}",
            "name": p["name"],
            "slug": p["name"].lower().replace(" ", "-"),
            "description": p["description"],
            "image": p["image"],
            "category": p["category"],
            "is_featured": p.get("is_featured", False),
        }
        await db.products.insert_one(dict(doc))


@app.on_event("startup")
async def on_startup():
    await seed_data()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
