from fastapi import FastAPI

app = FastAPI(
    title="Finance Platform API",
    description="API da plataforma inteligente de gestão financeira pessoal.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "finance-platform-api",
        "version": "0.1.0",
    }