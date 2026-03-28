# API Reference (auto overview)

This reference summarize main endpoints and examples. For full, canonical spec see `docs/openapi.yaml`.

## Base URL

`http://localhost:4000`

---

## Authentication

### POST /auth/register

Body (application/json):

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secretpass"
}
```

Responses:

- 201: created user (returns user without password)
- 409: conflict (user exists) — example error:

```json
{ "status": 409, "message": "User with this email already exists" }
```

### POST /auth/login

Body:

```json
{ "email": "jane@example.com", "password": "secretpass" }
```

Responses:

- 200: user object; cookies (accessToken, refreshToken) set
- 401: invalid credentials

---

## Stories

### GET /stories

Query: `page`, `perPage`, `category`

Response: Paginated list of stories (see `docs/openapi.yaml` -> `PaginatedStories`)

### POST /stories (authenticated)

Multipart form: `title`, `article`, `category`, `img` (file)

Responses:

- 201: created story
- 400: invalid input
- 401: unauthorized

---

## Profile

### GET /profile/me (authenticated)

Returns current user object.

### PATCH /profile/edit (authenticated)

Multipart form: optionally `name`, `password`, `avatar` (file)

Responses:

- 200: updated user
- 400: invalid input
- 401: unauthorized

---

## Travellers

### GET /travellers

Query: `page`, `limit`

### GET /travellers/{id}

Return traveller profile

### GET /travellers/{id}/stories

Query: `page`, `limit`

---

For full request/response schemas and examples open:

- `docs/openapi.yaml` (OpenAPI 3.0)
- Interactive UI: `http://localhost:4000/docs`
