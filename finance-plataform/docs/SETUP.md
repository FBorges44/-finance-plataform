# Finance Platform

## Estrutura

- `backend`: API FastAPI, banco e migrations.
- `frontend`: aplicação Next.js.
- `../docker-compose.yml`: PostgreSQL e Redis locais.

## Variáveis de ambiente

Copie `backend/.env.example` para `backend/.env` e ajuste:

- `DATABASE_URL`: conexão PostgreSQL.
- `REDIS_URL`: conexão Redis.
- `JWT_SECRET_KEY`: segredo com pelo menos 32 caracteres. Nunca use o valor do exemplo em produção.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: validade do token em minutos.

O frontend aceita `NEXT_PUBLIC_API_URL` em `frontend/.env.local`; o padrão é `http://localhost:8000`.

## Inicialização local

Na raiz `Personal_finance`:

```powershell
docker compose up -d postgres redis
```

Em outro terminal:

```powershell
cd finance-plataform\backend
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Em outro terminal:

```powershell
cd finance-plataform\frontend
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Testes e validação

```powershell
cd finance-plataform\backend
python -m pytest -q

cd ..\frontend
npm run lint
npm run build
```

## Sessão e proteção

As páginas internas validam o token com `/api/v1/auth/me` por meio do `AppShell`. Respostas `401` removem o token salvo e redirecionam para `/login`.