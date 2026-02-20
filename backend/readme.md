# PrimeTrade Backend

## Setup

1. Copy `.env.example` to `.env` and update the values.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the API:

   ```bash
   npm run dev
   ```

## Health Check

`GET /health`

## Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

## Tasks

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
