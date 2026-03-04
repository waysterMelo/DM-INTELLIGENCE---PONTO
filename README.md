# DM Intelligence - Ponto

Projeto reorganizado com separacao entre frontend e backend.

## Estrutura

```
.
|-- backend
|   |-- db.ts
|   |-- server.ts
|   `-- tsconfig.json
|-- frontend
|   |-- index.html
|   |-- src
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- docs
|-- package.json
`-- .env.example
```

## Scripts

- `npm run dev`: inicia backend + middleware do Vite servindo o frontend (padrao em `http://127.0.0.1:5173`).
- `npm run build`: gera build do frontend em `frontend/dist`.
- `npm run preview`: preview do build do frontend.
- `npm run lint`: validacao de tipos em frontend e backend.
- `npm run start`: inicia servidor Node/Express.

## Execucao local

1. `npm install`
2. Configure variaveis de ambiente em `.env.local` (ex.: `GEMINI_API_KEY`).
3. `npm run dev`
