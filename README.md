# Meu Produto — Template Fullstack Railway

Template fullstack com **Node.js + Fastify** no backend e **React + Vite** no frontend, pronto para deploy no Railway.

---

## Como rodar localmente

### Backend

```bash
cd backend
cp .env.example .env
# Preencher DATABASE_URL com seu PostgreSQL local
npm install
npm run dev
# Rodando em http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Rodando em http://localhost:5173
```

---

## Variáveis de ambiente

| Variável       | Onde usar | Descrição                              |
|----------------|-----------|----------------------------------------|
| `DATABASE_URL` | Backend   | URL completa do PostgreSQL             |
| `PORT`         | Backend   | Porta do servidor (Railway define automaticamente) |
| `NODE_ENV`     | Backend   | `development` ou `production`          |
| `VITE_API_URL` | Frontend  | URL pública do backend (só em produção)|

---

## Deploy no Railway (passo a passo)

1. Fazer push do projeto para o GitHub
2. Criar conta em railway.app com login via GitHub
3. New Project → Deploy from GitHub repo → selecionar este repositório
4. Adicionar serviço PostgreSQL: `+ New → Database → Add PostgreSQL`
5. No serviço de backend: `Variables → DATABASE_URL` (copiar do serviço PostgreSQL)
6. No serviço de frontend: `Variables → VITE_API_URL` = URL pública do backend
7. Deploy automático ativo — qualquer push no GitHub atualiza o produto
