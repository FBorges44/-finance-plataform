from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db


app = FastAPI(
    title="Finance Platform API",
    description="API da plataforma inteligente de gestão financeira pessoal.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "ok",
        "service": "finance-platform-api",
        "version": "0.1.0",
    }


@app.get("/api/v1/health/database")
async def database_health_check(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(text("SELECT 1"))
    value = result.scalar_one()

    return {
        "status": "ok",
        "database": "postgresql",
        "result": value,
    }