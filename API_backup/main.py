import os, json
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import asyncio
import uuid
import datetime
try:
    import asyncpg
except Exception:
    asyncpg = None

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://logline:logline@127.0.0.1:5432/logline")
app = FastAPI(title="LogLine Consciousness Gateway - Authentication Required")

# Security scheme
security = HTTPBearer()

# Active LogLine ID sessions (in production, use Redis or database)
active_sessions = {}

class LogLineIDAuth(BaseModel):
    logline_id: str
    handle: str
    entity_type: str

async def get_pool():
    if asyncpg is None:
        return None
    if not hasattr(app.state, "pool"):
        app.state.pool = await asyncpg.create_pool(dsn=DATABASE_URL, min_size=1, max_size=5)
    return app.state.pool

@app.get("/")
@app.get("/healthz")
async def healthz():
    try:
        if asyncpg:
            pool = await get_pool()
            async with pool.acquire() as con:
                v = await con.fetchval("select 'ok'")
            return {"ok": True, "db": str(v)}
        return {"ok": True, "db": "mock"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

# --- mount sectors (LogLine ID & Onboarding) ---
try:
    from .LogLineID import router as id_router
    app.include_router(id_router, prefix="/id")
except Exception:
    pass
try:
    from .Onboarding import router as onboard_router
    app.include_router(onboard_router, prefix="/onboard")
except Exception:
    pass
# --- end sectors ---
