# CLAUDE.md — Template Fullstack Railway

Crie um projeto template fullstack do zero com a estrutura e tecnologias abaixo.
Siga exatamente a estrutura de pastas, requisitos e convenções descritas aqui.

---

## Tecnologias

- **Backend:** Node.js + Fastify + TypeScript
- **Frontend:** React + Vite + TypeScript
- **Banco de dados:** PostgreSQL (conexão via variável de ambiente `DATABASE_URL`)
- **Deploy:** Railway.app

---

## Estrutura de pastas

```
curso-claude-code-template/
├── backend/
│   ├── src/
│   │   ├── index.ts        # entry point — inicializa e sobe o servidor Fastify
│   │   ├── routes.ts       # todas as rotas da API registradas aqui
│   │   └── db.ts           # conexão com PostgreSQL via pg + DATABASE_URL
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile          # necessário para o Railway fazer o build
│   └── .env.example        # modelo das variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # componente principal da aplicação
│   │   ├── main.tsx        # entry point do React
│   │   └── api.ts          # funções utilitárias para chamar o backend
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts      # configuração do Vite com proxy para o backend
├── .gitignore
└── README.md
```

---

## Backend — Requisitos detalhados

### Servidor
- Fastify com TypeScript
- Porta: `process.env.PORT || 3000`
- CORS habilitado para qualquer origem (`origin: '*'`)
- Registrar plugin `@fastify/cors`

### Rotas obrigatórias

| Método | Rota          | Descrição                                 |
|--------|---------------|-------------------------------------------|
| GET    | `/health`     | Retorna `{ status: "ok", timestamp: new Date() }` |
| GET    | `/api/items`  | Lista todos os itens do banco             |
| POST   | `/api/items`  | Cria um novo item — body: `{ nome: string }` |

### Banco de dados
- Lib: `pg` (node-postgres)
- Ler `DATABASE_URL` do `process.env`
- No startup, executar `CREATE TABLE IF NOT EXISTS` para garantir que a tabela existe

### Schema da tabela `items`
```sql
CREATE TABLE IF NOT EXISTS items (
  id        SERIAL PRIMARY KEY,
  nome      TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);
```

### `src/db.ts`
```ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

### `src/index.ts`
- Importar Fastify, registrar CORS, registrar rotas
- Chamar função de inicialização do banco antes de subir o servidor
- Logar a porta em que está rodando

### `src/routes.ts`
- Exportar função `registerRoutes(app: FastifyInstance)`
- Implementar as 3 rotas descritas acima usando o `pool` de `db.ts`

### `package.json` (backend)
Scripts obrigatórios:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```
Dependências obrigatórias: `fastify`, `@fastify/cors`, `pg`
Dev dependencies: `typescript`, `ts-node-dev`, `@types/node`, `@types/pg`

### `tsconfig.json` (backend)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### `Dockerfile` (backend)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### `.env.example`
```
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco
PORT=3000
NODE_ENV=development
```

---

## Frontend — Requisitos detalhados

### Interface
- Título principal: **"Meu Produto"**
- Listagem dos itens buscados em `GET /api/items`
- Formulário com campo `nome` + botão "Adicionar"
- Ao submeter, chamar `POST /api/items` e atualizar a lista
- Estado de carregamento simples enquanto busca os dados

### `src/api.ts`
```ts
const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function getItems() {
  const res = await fetch(`${BASE_URL}/api/items`);
  return res.json();
}

export async function createItem(nome: string) {
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome }),
  });
  return res.json();
}
```

### `vite.config.ts`
Configurar proxy para que em desenvolvimento o frontend chame o backend sem problema de CORS:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
});
```

### Variável de ambiente (frontend)
- Em desenvolvimento: `VITE_API_URL` vazia (proxy do Vite resolve)
- Em produção no Railway: `VITE_API_URL=https://url-do-seu-backend.railway.app`

### `package.json` (frontend)
Scripts obrigatórios:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## `.gitignore` (raiz do projeto)

```
node_modules/
dist/
.env
.env.local
*.log
```

---

## `README.md`

Documentar obrigatoriamente:

### Como rodar localmente

**Backend:**
```bash
cd backend
cp .env.example .env
# Preencher DATABASE_URL com seu PostgreSQL local
npm install
npm run dev
# Rodando em http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Rodando em http://localhost:5173
```

### Variáveis de ambiente

| Variável       | Onde usar | Descrição                              |
|----------------|-----------|----------------------------------------|
| `DATABASE_URL` | Backend   | URL completa do PostgreSQL             |
| `PORT`         | Backend   | Porta do servidor (Railway define automaticamente) |
| `NODE_ENV`     | Backend   | `development` ou `production`          |
| `VITE_API_URL` | Frontend  | URL pública do backend (só em produção)|

### Deploy no Railway (passo a passo)

1. Fazer push do projeto para o GitHub
2. Criar conta em railway.app com login via GitHub
3. New Project → Deploy from GitHub repo → selecionar este repositório
4. Adicionar serviço PostgreSQL: `+ New → Database → Add PostgreSQL`
5. No serviço de backend: `Variables → DATABASE_URL` (copiar do serviço PostgreSQL)
6. No serviço de frontend: `Variables → VITE_API_URL` = URL pública do backend
7. Deploy automático ativo — qualquer push no GitHub atualiza o produto

---

## Instruções finais para o Claude Code

1. Criar todos os arquivos e pastas exatamente como especificado acima
2. Instalar as dependências em cada pasta (`npm install`)
3. Verificar se o backend compila sem erros (`npm run build`)
4. Confirmar a lista completa de arquivos criados
5. Mostrar o comando para testar localmente