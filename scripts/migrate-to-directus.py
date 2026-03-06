#!/usr/bin/env python3
"""
Directus Migration Script
- เพิ่ม fields ให้ collection `products`
- สร้าง collections: highlights, profile (singleton), contacts
- migrate ข้อมูลจาก JSON files ทั้งหมด
"""
import json
import ssl
import urllib.request
import urllib.error
import os

BASE     = "https://kenzchirodesksetup-directus-98ec69-72-62-251-164.traefik.me"
TOKEN    = "76lW1erA9voH5TliL1hk3dH9qt1ilcxX"
DATA_DIR = os.path.join(os.path.dirname(__file__), "../src/data")

# ── SSL (traefik.me self-signed) ──────────────────────────────────────────────
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# ── API helper ────────────────────────────────────────────────────────────────
def api(method, path, data=None):
    url  = f"{BASE}{path}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req  = urllib.request.Request(url, data=body, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            body = resp.read().decode("utf-8").strip()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8").strip()
            return json.loads(body) if body else {"errors": [{"message": str(e)}]}
        except Exception:
            return {"errors": [{"message": str(e)}]}

def ok(result):
    return "errors" not in result

def err_msg(result):
    return result["errors"][0]["message"] if result.get("errors") else "unknown"

# ── Add field to existing collection ─────────────────────────────────────────
IFACE_MAP = {"text": "input-multiline", "json": "input-code"}

def add_field(collection, field, type_):
    payload = {
        "field": field,
        "type": type_,
        "meta": {
            "hidden": False,
            "readonly": False,
            "interface": IFACE_MAP.get(type_, "input"),
            "display": "raw",
            "width": "full",
        },
        "schema": {"is_nullable": True, "default_value": None},
    }
    result = api("POST", f"/fields/{collection}", payload)
    if ok(result):
        print(f"    ✅ {field} ({type_})")
    else:
        msg = err_msg(result)
        if "already" in msg.lower():
            print(f"    ↩️  {field} — already exists")
        else:
            print(f"    ❌ {field}: {msg}")

# ── Standard system fields (status, sort, timestamps) ────────────────────────
STD_FIELDS = [
    {
        "field": "status",
        "type": "string",
        "meta": {
            "width": "full",
            "interface": "select-dropdown",
            "display": "labels",
            "options": {"choices": [
                {"text": "Published", "value": "published"},
                {"text": "Draft",     "value": "draft"},
                {"text": "Archived",  "value": "archived"},
            ]},
            "display_options": {"choices": [
                {"background": "#2F9D72", "value": "published"},
                {"background": "#18222F", "value": "draft"},
                {"background": "#F5A623", "value": "archived"},
            ]},
        },
        "schema": {"default_value": "draft", "is_nullable": False},
    },
    {
        "field": "sort",
        "type": "integer",
        "meta": {"hidden": True, "interface": "input"},
        "schema": {"is_nullable": True},
    },
    {
        "field": "date_created",
        "type": "timestamp",
        "meta": {"hidden": True, "readonly": True, "interface": "datetime",
                 "special": ["date-created"]},
        "schema": {"is_nullable": True},
    },
    {
        "field": "date_updated",
        "type": "timestamp",
        "meta": {"hidden": True, "readonly": True, "interface": "datetime",
                 "special": ["date-updated"]},
        "schema": {"is_nullable": True},
    },
]

# ── Create collection ─────────────────────────────────────────────────────────
def create_collection(name, singleton=False):
    payload = {
        "collection": name,
        "meta": {"singleton": singleton, "icon": "box"},
        "schema": {},
        "fields": [] if singleton else STD_FIELDS,
    }
    result = api("POST", "/collections", payload)
    if ok(result):
        print(f"  ✅ '{name}' created")
    else:
        msg = err_msg(result)
        if "already" in msg.lower():
            print(f"  ↩️  '{name}' already exists")
        else:
            print(f"  ❌ {msg}")

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 1 — SCHEMA SETUP
# ══════════════════════════════════════════════════════════════════════════════

PRODUCT_FIELDS = [
    ("brand",       "string"),
    ("img",         "string"),
    ("description", "text"),
    ("code",        "string"),
    ("tag",         "string"),
    ("links",       "json"),
    ("group_items", "json"),
]

ITEM_FIELDS = [
    ("title",       "string"),
    ("category",    "json"),
    *PRODUCT_FIELDS,
]

print("╔══════════════════════════════════════════╗")
print("║  PHASE 1 — SCHEMA                        ║")
print("╚══════════════════════════════════════════╝")

# 1-A: products
print("\n📦 [1/4] products — add missing fields")
for f in PRODUCT_FIELDS:
    add_field("products", *f)

# 1-B: highlights
print("\n🌟 [2/4] highlights — create collection + fields")
create_collection("highlights")
for f in ITEM_FIELDS:
    add_field("highlights", *f)

# 1-C: profile (singleton)
print("\n👤 [3/4] profile — create singleton + fields")
create_collection("profile", singleton=True)
for f in [
    ("displayName", "string"),
    ("bio",         "string"),
    ("avatar",      "string"),
    ("cover",       "string"),
    ("socials",     "json"),
]:
    add_field("profile", *f)

# 1-D: contacts
print("\n📞 [4/4] contacts — create collection + fields")
create_collection("contacts")
for f in [
    ("title",    "string"),
    ("subtitle", "string"),
    ("icon",     "string"),
    ("url",      "string"),
]:
    add_field("contacts", *f)

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 2 — DATA MIGRATION
# ══════════════════════════════════════════════════════════════════════════════
print("\n╔══════════════════════════════════════════╗")
print("║  PHASE 2 — DATA MIGRATION                ║")
print("╚══════════════════════════════════════════╝")

# 2-A: ลบ test data ใน products
print("\n🧹 Clearing draft test data in `products`...")
existing = api("GET", "/items/products?fields=id,status,title")
deleted = 0
for item in existing.get("data", []):
    if item.get("status") == "draft":
        api("DELETE", f"/items/products/{item['id']}")
        print(f"  🗑️  Deleted draft — '{item.get('title', item['id'])}'")
        deleted += 1
if deleted == 0:
    print("  ✔  Nothing to delete")

# 2-B: Migrate products (items.json)
print("\n🚚 Migrating `products` ← items.json")
with open(os.path.join(DATA_DIR, "items.json")) as f:
    items_data = json.load(f)["items"]

for i, item in enumerate(items_data, 1):
    payload = {**item, "status": "published", "sort": i}
    result = api("POST", "/items/products", payload)
    status = "✅" if ok(result) else f"❌ {err_msg(result)}"
    print(f"  {status} [{i:02}/{len(items_data)}] {item['title']}")

# 2-C: Migrate highlights (highlights.json)
print("\n🚚 Migrating `highlights` ← highlights.json")
with open(os.path.join(DATA_DIR, "highlights.json")) as f:
    highlights_data = json.load(f)["highlights"]

for i, item in enumerate(highlights_data, 1):
    payload = {**item, "status": "published", "sort": i}
    result = api("POST", "/items/highlights", payload)
    status = "✅" if ok(result) else f"❌ {err_msg(result)}"
    print(f"  {status} [{i:02}/{len(highlights_data)}] {item['title']}")

# 2-D: Migrate profile (profile.json) — singleton: PATCH
print("\n🚚 Migrating `profile` ← profile.json")
with open(os.path.join(DATA_DIR, "profile.json")) as f:
    profile_data = json.load(f)

result = api("PATCH", "/items/profile", profile_data)
if not ok(result):
    # singleton อาจต้อง POST ครั้งแรก
    result = api("POST", "/items/profile", profile_data)
print(f"  {'✅ Done' if ok(result) else '❌ ' + err_msg(result)}")

# 2-E: Migrate contacts (contacts.json)
print("\n🚚 Migrating `contacts` ← contacts.json")
with open(os.path.join(DATA_DIR, "contacts.json")) as f:
    contacts_data = json.load(f)["contacts"]

for i, item in enumerate(contacts_data, 1):
    payload = {**item, "status": "published", "sort": i}
    result = api("POST", "/items/contacts", payload)
    status = "✅" if ok(result) else f"❌ {err_msg(result)}"
    print(f"  {status} [{i:02}/{len(contacts_data)}] {item['title']}")

print("\n🎉  Migration complete!")
