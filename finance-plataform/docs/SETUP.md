# Finance Platform

Para publicar em produção, siga [DEPLOY.md](DEPLOY.md).

## Deploy (Vercel + API)

A Vercel hospeda o frontend, mas `http://localhost:8000` aponta para o navegador do visitante e não para a API. Publique o backend em um serviço que execute Python/FastAPI e configure:

- No backend: `CORS_ORIGINS=https://SEU-PROJETO.vercel.app`, `DATABASE_URL` e um `JWT_SECRET_KEY` seguro. Para múltiplas URLs permitidas, separe-as por vírgula.
- Para frontend e API em domínios diferentes, use `AUTH_COOKIE_SECURE=true` e `AUTH_COOKIE_SAMESITE=none`, sempre sob HTTPS. Configure também `FRONTEND_URL` e as credenciais SMTP para habilitar o e-mail de recuperação.
- Na Vercel, em **Settings → Environment Variables**: `NEXT_PUBLIC_API_URL=https://SUA-API.exemplo.com`, sem `/` ao final, para Production (e Preview se necessário).

Após mudar `NEXT_PUBLIC_API_URL`, faça um novo deploy da Vercel: variáveis `NEXT_PUBLIC_` são incorporadas no build. Antes de testar o login, abra `https://SUA-API.exemplo.com/health` no navegador e confirme que retorna JSON.

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
- `AUTH_COOKIE_*`: protege a sessão no cookie `HttpOnly`; em produção com domínios distintos, use `SECURE=true` e `SAMESITE=none`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL` e `FRONTEND_URL`: necessários para entregar links de recuperação de senha.

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
