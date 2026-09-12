"""
FastAPI application factory and configuration.

Esta é a aplicação principal da plataforma de gestão financeira pessoal.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.modules.accounts.router import router as accounts_router
from app.modules.auth.router import router as auth_router
from app.modules.dashboard.router import router as dashboard_router
from app.modules.transactions.router import router as transactions_router
from app.modules.users.router import router as users_router

# Configurar logging
logger = logging.getLogger(__name__)

# Exportar app para uso direto
__all__ = ["app", "create_app"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerenciar o ciclo de vida da aplicação.
    """
    logger.info("🚀 Iniciando aplicação Folio API")
    yield
    logger.info("🛑 Encerrando aplicação Folio API")


def create_app() -> FastAPI:
    """
    Criar e configurar a aplicação FastAPI.
    
    Returns:
        FastAPI: Aplicação configurada e pronta para uso.
    """
    # Instanciar app
    _app = FastAPI(
        title="Folio API",
        description="API da plataforma inteligente de gestão financeira pessoal.",
        version="0.1.0",
        lifespan=lifespan,
    )

    # Configurar CORS
    _configure_cors(_app)

    # Incluir rotas
    _include_routers(_app)

    # Incluir health checks
    _include_health_checks(_app)

    logger.info("✅ Aplicação Folio API configurada com sucesso")
    return _app


def _configure_cors(app: FastAPI) -> None:
    """
    Configurar middleware CORS.
    
    Args:
        app: Instância da aplicação FastAPI.
    """
    origins = [
        origin.strip().rstrip("/")
        for origin in settings.cors_origins.split(",")
        if origin.strip()
    ]
    
    logger.info(f"📡 Configurando CORS para origens: {origins}")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def _include_routers(app: FastAPI) -> None:
    """
    Incluir todos os routers na aplicação.
    
    Args:
        app: Instância da aplicação FastAPI.
    """
    routers = [
        (users_router, "Usuários"),
        (auth_router, "Autenticação"),
        (dashboard_router, "Dashboard"),
        (accounts_router, "Contas"),
        (transactions_router, "Transações"),
    ]
    
    for router, description in routers:
        app.include_router(router, prefix="/api/v1")
        logger.debug(f"✅ Router {description} incluído")


def _include_health_checks(app: FastAPI) -> None:
    """
    Incluir endpoints de health check.
    
    Args:
        app: Instância da aplicação FastAPI.
    """
    @app.get(
        "/health",
        tags=["Health"],
        summary="Health check básico",
        description="Verifica se a API está respondendo.",
    )
    async def health_check():
        """Verificação de saúde básica da API."""
        return {
            "status": "ok",
            "service": "finance-platform-api",
            "version": "0.1.0",
        }

    @app.get(
        "/api/v1/health",
        tags=["Health"],
        summary="Health check da API",
        description="Verifica se a API está respondendo.",
    )
    async def api_health_check():
        """Verificação de saúde da API."""
        return {
            "status": "ok",
            "service": "finance-platform-api",
            "version": "0.1.0",
        }

    @app.get(
        "/api/v1/health/database",
        tags=["Health"],
        summary="Health check do banco de dados",
        description="Verifica a conectividade com o banco de dados.",
    )
    async def database_health_check(
        db: AsyncSession = Depends(get_db),
    ):
        """Verificação de saúde do banco de dados."""
        try:
            result = await db.execute(text("SELECT 1"))
            value = result.scalar_one()
            
            return {
                "status": "ok",
                "database": "postgresql",
                "result": value,
            }
        except Exception as e:
            logger.error(f"❌ Erro ao conectar ao banco de dados: {e}")
            return {
                "status": "error",
                "database": "postgresql",
                "error": str(e),
            }


# Criar instância global da aplicação
app = create_app()

# Entrypoint para ASGI servers (Gunicorn, Uvicorn, etc)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info",
    )