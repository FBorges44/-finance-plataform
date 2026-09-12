# Deploy de produção

Este repositório foi preparado para rodar com a API no Render e o frontend na Vercel. O banco precisa ser PostgreSQL gerenciado (Render Postgres, Neon ou Supabase).

## 1. Banco de dados

Crie o banco e copie a URL de conexão. A API usa `asyncpg`, então a variável deve começar com `postgresql+asyncpg://`.

Exemplo:

```text
postgresql+asyncpg://usuario:senha@host:5432/folio
```

## 2. API no Render

No Render, selecione **New → Blueprint** e escolha este repositório. O arquivo `render.yaml` cria o serviço `folio-api` a partir de `backend` e executa `alembic upgrade head` antes de cada deploy.

Preencha as variáveis marcadas como secretas no serviço:

```text
DATABASE_URL=postgresql+asyncpg://...
CORS_ORIGINS=https://SEU-PROJETO.vercel.app
FRONTEND_URL=https://SEU-PROJETO.vercel.app
SMTP_HOST=...
SMTP_USERNAME=...
SMTP_PASSWORD=...
SMTP_FROM_EMAIL=no-reply@seudominio.com
```

`JWT_SECRET_KEY` é gerada pelo Blueprint. Não a substitua em cada deploy, pois isso encerra as sessões existentes.

Após o deploy, confirme `https://SUA-API.onrender.com/health`.

## 3. Frontend na Vercel

Importe o repositório no painel da Vercel e defina **Root Directory** como `frontend` se o repositório aberto for `finance-plataform`; se abrir o repositório-pai, use `finance-plataform/frontend`.

Em **Settings → Environment Variables**, adicione para Production e Preview:

```text
NEXT_PUBLIC_API_URL=/backend
BACKEND_API_URL=https://SUA-API.onrender.com
```

`BACKEND_API_URL` não pode ter o prefixo `NEXT_PUBLIC_`: ela é usada apenas pelo rewrite do servidor Vercel. O navegador só acessa `/backend`, e a Vercel encaminha a requisição para a API. Com isso, o cookie de sessão permanece no domínio do frontend e não depende de cookies de terceiros.

Faça o deploy e teste:

```text
https://SEU-PROJETO.vercel.app/backend/health
https://SEU-PROJETO.vercel.app/login
```

## 4. Domínio próprio

Depois de configurar `app.seudominio.com` na Vercel, atualize no Render:

```text
CORS_ORIGINS=https://app.seudominio.com
FRONTEND_URL=https://app.seudominio.com
```

Mantenha `AUTH_COOKIE_SECURE=true` e `AUTH_COOKIE_SAMESITE=lax`. O proxy Vercel preserva a sessão no mesmo domínio do app.

## Checklist

- Não publique arquivos `.env`.
- `DATABASE_URL` e chaves SMTP ficam somente no Render.
- `NEXT_PUBLIC_API_URL` deve ser exatamente `/backend`.
- Faça um novo deploy da Vercel ao mudar qualquer variável `NEXT_PUBLIC_`.
- Se o banco já existia, o comando de pre-deploy aplica a migration de recuperação de senha automaticamente.
