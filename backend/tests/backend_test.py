"""Backend tests for MM Comércio site vitrine."""
import os
import urllib.parse
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://macro-supply-store.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Settings ----
def test_settings_whatsapp_number(client):
    r = client.get(f"{API}/settings", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("whatsapp_number") == "554134032999"


# ---- Categories ----
def test_categories_count_and_slugs(client):
    r = client.get(f"{API}/categories", timeout=15)
    assert r.status_code == 200
    cats = r.json()
    assert isinstance(cats, list)
    assert len(cats) == 4
    slugs = sorted([c["slug"] for c in cats])
    assert slugs == sorted(["limpeza-geral", "descartaveis", "papeis", "higiene"])


# ---- Products ----
def test_products_total_count(client):
    r = client.get(f"{API}/products", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 9
    for p in items:
        assert "product_id" in p
        assert "name" in p
        assert "_id" not in p  # ObjectId must be excluded


def test_products_featured_azulim(client):
    r = client.get(f"{API}/products", params={"featured": "true"}, timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 5
    names = [p["name"] for p in items]
    expected_keywords = ["Limpador Perfumado", "Limpa Vidros", "Multiuso",
                         "Desinfetante Super Concentrado", "Lava Louças"]
    for kw in expected_keywords:
        assert any(kw in n for n in names), f"Missing featured product containing '{kw}'. Got: {names}"
    # All must be Azulim
    for n in names:
        assert "Azulim" in n


def test_products_filter_by_category(client):
    r = client.get(f"{API}/products", params={"category": "papeis"}, timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1
    for p in items:
        assert p["category"] == "papeis"


def test_products_search(client):
    r = client.get(f"{API}/products", params={"search": "Azulim"}, timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 5


def test_get_product_by_id(client):
    r = client.get(f"{API}/products/prod_001", timeout=15)
    assert r.status_code == 200
    p = r.json()
    assert p["product_id"] == "prod_001"
    assert "_id" not in p


def test_get_product_not_found(client):
    r = client.get(f"{API}/products/does_not_exist", timeout=15)
    assert r.status_code == 404


# ---- WhatsApp chat ----
def test_chat_whatsapp_generates_wame_url(client):
    payload = {"name": "TEST_User", "phone": "11999998888",
               "message": "Oi! Vi o site e gostaria de informações.",
               "product": "Azulim Multiuso"}
    r = client.post(f"{API}/chat/whatsapp", json=payload, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["number"] == "554134032999"
    assert data["whatsapp_url"].startswith("https://wa.me/554134032999?text=")
    decoded = urllib.parse.unquote(data["whatsapp_url"].split("?text=", 1)[1])
    assert "TEST_User" in decoded
    assert "Azulim Multiuso" in decoded
    assert "Oi! Vi o site" in decoded
    assert "11999998888" in decoded


def test_chat_whatsapp_minimal(client):
    r = client.post(f"{API}/chat/whatsapp", json={"message": "Olá"}, timeout=15)
    assert r.status_code == 200
    assert "wa.me/554134032999" in r.json()["whatsapp_url"]
