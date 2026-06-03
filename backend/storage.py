"""Object storage helper using Emergent's storage API."""
import os
import logging
import requests

logger = logging.getLogger(__name__)
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"

_storage_key = None


def _key():
    return os.environ.get("EMERGENT_LLM_KEY")


def _app_name():
    return os.environ.get("APP_NAME", "mm-distribuidora")


class _AppNameProxy(str):
    def __new__(cls):
        return str.__new__(cls, _app_name())


APP_NAME = _AppNameProxy()


def init_storage():
    global _storage_key
    if _storage_key:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": _key()}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    logger.info("Storage initialized")
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")
