# PrimeTrade Assignment

This repo contains the backend API and frontend UI for the internship assignment.

- `backend/` - Express + MongoDB API
- `frontend/` - React UI (Vite)

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env` and update the values.
2. Install dependencies:

	```bash
	cd backend
	npm install
	```

3. Start the API:

	```bash
	npm run dev
	```

## Frontend Setup

1. Install dependencies:

	```bash
	cd frontend
	npm install
	```

2. Start the UI:

	```bash
	npm run dev
	```

## Postman Collection

Import [backend/docs/PrimeTrade.postman_collection.json](backend/docs/PrimeTrade.postman_collection.json).

Set collection variables:

- `baseUrl`: `http://localhost:4000`
- `token`: JWT from login
- `taskId`: existing task id

## Scalability Notes

- Split auth/task into modules and move to separate services if traffic grows.
- Add Redis caching for read-heavy task lists and rate limiting.
- Introduce a gateway and horizontal scaling behind a load balancer.
