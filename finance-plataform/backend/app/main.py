from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.accounts.router import router as accounts_router
from app.modules.auth.router import router as auth_router
from app.modules.dashboard.router import router as dashboard_router
from app.modules.transactions.router import router as transactions_router
from app.modules.planning.router import router as planning_router
from app.modules.users.router import router as users_router


app = FastAPI(
    title="Folio API",
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

app.include_router(
    users_router,
    prefix="/api/v1",
)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(accounts_router, prefix="/api/v1")
app.include_router(transactions_router, prefix="/api/v1")
app.include_router(planning_router, prefix="/api/v1")


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