# API Reference (overview)

This project exposes a REST API described by the OpenAPI spec at `docs/openapi.yaml`.

View the interactive documentation locally:

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm run dev
```

3. Open Swagger UI in your browser:

http://localhost:4000/docs

Quick curl examples:

- Get categories:

```bash
curl -sS http://localhost:4000/categories | jq
```

- Register user:

```bash
curl -sS -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secretpass"}' | jq
```

- View raw OpenAPI spec:

```bash
curl -sS http://localhost:4000/docs/openapi.yaml
```

Notes:

- The interactive UI uses cookie authentication (accessToken cookie). Login sets cookies via `POST /auth/login`.
- See `docs/openapi.yaml` for full request/response schemas and examples.
