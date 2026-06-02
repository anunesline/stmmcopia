from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Header, Cookie, UploadFile, File, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, urllib.parse, uuid, httpx
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime, timezone, timedelta

from storage import init_storage, put_object, get_object, APP_NAME
from auth import create_token, decode_token, verify_password, seed_admin

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_EMAILS = {e.strip().lower() for e in os.environ.get('ADMIN_EMAILS', '').split(',') if e.strip()}

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ Models ============

class ChatMessage(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    message: str
    product: Optional[str] = None


class LoginIn(BaseModel):
    email: str
    password: str

class ProductIn(BaseModel):
    name: str
    description: str
    image: str
    category: str
    is_featured: bool = False

class CategoryIn(BaseModel):
    name: str
    slug: str

# ============ Auth ============

async def get_current_user(
    authorization: Optional[str] = Header(None),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    payload = decode_token(token)
    user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(user: dict = Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only")
    return user


@api_router.post("/auth/login")
async def auth_login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")
    token = create_token(user["user_id"], user["email"])
    user_safe = {k: v for k, v in user.items() if k not in ("_id", "password_hash")}
    return {"user": user_safe, "session_token": token}


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def auth_logout():
    # Stateless JWT — client just discards the token
    return {"ok": True}

# ============ Catalog (public) ============

@api_router.get("/categories")
async def list_categories():
    items = await db.categories.find({}, {"_id": 0}).sort("name", 1).to_list(100)
    return items

@api_router.get("/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None,
                        search: Optional[str] = None, limit: int = 100):
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

# ============ Admin CRUD ============

@api_router.post("/admin/products")
async def create_product(payload: ProductIn, user: dict = Depends(require_admin)):
    doc = {
        "product_id": f"prod_{uuid.uuid4().hex[:10]}",
        "name": payload.name,
        "slug": payload.name.lower().replace(" ", "-"),
        "description": payload.description,
        "image": payload.image,
        "category": payload.category,
        "is_featured": payload.is_featured,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.products.insert_one(dict(doc))
    doc.pop("_id", None)
    return doc

@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, payload: ProductIn, user: dict = Depends(require_admin)):
    update = payload.model_dump()
    update["slug"] = payload.name.lower().replace(" ", "-")
    r = await db.products.update_one({"product_id": product_id}, {"$set": update})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    return doc

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(require_admin)):
    await db.products.delete_one({"product_id": product_id})
    return {"ok": True}

@api_router.post("/admin/categories")
async def create_category(payload: CategoryIn, user: dict = Depends(require_admin)):
    slug = payload.slug.lower().strip()
    if await db.categories.find_one({"slug": slug}):
        raise HTTPException(status_code=400, detail="Categoria já existe")
    doc = {
        "category_id": f"cat_{uuid.uuid4().hex[:8]}",
        "name": payload.name,
        "slug": slug,
        "icon": "Sparkles",
    }
    await db.categories.insert_one(dict(doc))
    doc.pop("_id", None)
    return doc

@api_router.put("/admin/categories/{category_id}")
async def update_category(category_id: str, payload: CategoryIn, user: dict = Depends(require_admin)):
    update = {"name": payload.name, "slug": payload.slug.lower().strip()}
    r = await db.categories.update_one({"category_id": category_id}, {"$set": update})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    doc = await db.categories.find_one({"category_id": category_id}, {"_id": 0})
    return doc

@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str, user: dict = Depends(require_admin)):
    await db.categories.delete_one({"category_id": category_id})
    return {"ok": True}

# ============ Upload ============

MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
              "gif": "image/gif", "webp": "image/webp"}

@api_router.post("/admin/upload")
async def upload(file: UploadFile = File(...), user: dict = Depends(require_admin)):
    ext = (file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin").lower()
    if ext not in MIME_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de imagem inválido")
    content_type = MIME_TYPES[ext]
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Arquivo muito grande (máx 10MB)")
    file_id = uuid.uuid4().hex
    path = f"{APP_NAME}/products/{file_id}.{ext}"
    result = put_object(path, data, content_type)
    record_id = str(uuid.uuid4())
    await db.files.insert_one({
        "id": record_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    # Public URL via our backend serves the file
    backend_url = os.environ.get("PUBLIC_BACKEND_URL", "")
    public_url = f"/api/files/{result['path']}"
    return {"url": public_url, "path": result["path"], "size": result.get("size", len(data))}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return Response(
        content=data,
        media_type=record.get("content_type", content_type),
        headers={"Cache-Control": "public, max-age=86400"},
    )

@api_router.get("/admin/leads")
async def list_leads(user: dict = Depends(require_admin), limit: int = 200):
    items = await db.chat_messages.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return items


@api_router.delete("/admin/leads/{message_id}")
async def delete_lead(message_id: str, user: dict = Depends(require_admin)):
    await db.chat_messages.delete_one({"message_id": message_id})
    return {"ok": True}


# ============ Settings & WhatsApp ============

@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"key": "global"}, {"_id": 0})
    if not doc:
        return {"whatsapp_number": "554134032999"}
    return {"whatsapp_number": doc.get("whatsapp_number", "554134032999")}


@api_router.post("/chat/whatsapp")
async def chat_whatsapp(payload: ChatMessage):
    settings_doc = await db.settings.find_one({"key": "global"}, {"_id": 0}) or {}
    number = settings_doc.get("whatsapp_number", "554134032999")
    doc = {
        "message_id": f"msg_{uuid.uuid4().hex[:10]}",
        "name": payload.name, "phone": payload.phone,
        "message": payload.message, "product": payload.product,
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

# ============ Seed ============

async def seed_data():
    if not await db.settings.find_one({"key": "global"}):
        await db.settings.insert_one({"key": "global", "whatsapp_number": "554134032999"})
    categories = [
        {"category_id": "cat_limpeza", "name": "Limpeza Geral", "slug": "limpeza-geral", "icon": "Sparkles"},
        {"category_id": "cat_descartaveis", "name": "Descartáveis", "slug": "descartaveis", "icon": "Package"},
        {"category_id": "cat_papeis", "name": "Papéis", "slug": "papeis", "icon": "FileText"},
        {"category_id": "cat_higiene", "name": "Higiene", "slug": "higiene", "icon": "Droplets"},
    ]
    for c in categories:
        await db.categories.update_one({"category_id": c["category_id"]}, {"$setOnInsert": c}, upsert=True)
    # Only seed products if collection is empty
    count = await db.products.count_documents({})
    if count == 0:
        azulim_perfumado = "https://images.unsplash.com/photo-1585421514738-01798e348b17?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
        azulim_vidros = "https://images.unsplash.com/photo-1563453392212-326f5e854473?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
        azulim_multi = "https://images.unsplash.com/photo-1583947215259-38e31be8751f?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
        azulim_desinf = "https://images.unsplash.com/photo-1626379481874-3dc5678fa8ca?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
        azulim_louca = "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?crop=entropy&cs=srgb&fm=jpg&w=700&q=85"
        products = [
            ("Azulim Limpador Perfumado", "limpeza-geral", azulim_perfumado, True, "Limpador perfumado Azulim — fragrância marcante e ação prolongada."),
            ("Azulim Limpa Vidros", "limpeza-geral", azulim_vidros, True, "Limpa vidros Azulim — alto brilho, sem manchas."),
            ("Azulim Multiuso", "limpeza-geral", azulim_multi, True, "Multiuso Azulim — limpa, desengordura e perfuma."),
            ("Azulim Desinfetante Super Concentrado", "higiene", azulim_desinf, True, "Desinfetante super concentrado Azulim — ação bactericida prolongada."),
            ("Azulim Lava Louças", "limpeza-geral", azulim_louca, True, "Lava-louças Azulim — alta concentração, espuma rica."),
        ]
        for i, (name, cat, img, feat, desc) in enumerate(products):
            await db.products.insert_one({
                "product_id": f"prod_{i+1:03d}", "name": name,
                "slug": name.lower().replace(" ", "-"),
                "description": desc, "image": img, "category": cat,
                "is_featured": feat,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await seed_data()
    await seed_admin(db)
    try:
        init_storage()
    except Exception as e:
        logging.warning(f"Storage init failed (will retry on first upload): {e}")


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
