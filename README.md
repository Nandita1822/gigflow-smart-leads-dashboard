# GigFlow - Smart Leads Dashboard

Production-ready MERN lead management dashboard with role-based access, JWT auth, MongoDB pagination, debounced search, CSV export, and a responsive CRM-style React UI.

## Stack

- Frontend: React, TypeScript, TailwindCSS, React Router, Axios, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs
- Deployment targets: Vercel frontend, Render backend, MongoDB Atlas database
- Bonus: persisted dark mode support

## Project Structure

```text
backend/
  src/
    config/        environment and database setup
    controllers/   auth and lead controllers
    middleware/    auth, role, validation, error handling
    models/        Mongoose schemas
    routes/        REST routes
    utils/         shared API helpers
    validators/    Zod schemas
frontend/
  src/
    api/           Axios client and API modules
    components/    layout, UI, and lead components
    context/       auth persistence
    hooks/         debounced search hook
    pages/         auth and dashboard pages
    routes/        protected route wrapper
    schemas/       form validation schemas
    types/         shared frontend types
```

## Local Setup

1. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Set `MONGODB_URI`, `JWT_SECRET`, and `VITE_API_URL`.

4. Run the apps:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Backend runs on `http://localhost:5000`; frontend runs on `http://localhost:5173`.

## Docker

```bash
docker compose up --build
```

The frontend is available at `http://localhost:5173`, backend at `http://localhost:5000`, and MongoDB at `localhost:27017`.

## Roles

- Admin: create leads, update leads, delete leads, export CSV
- Sales User: view leads and update lead status only

The first registered user is automatically promoted to Admin so a fresh deployment can be administered immediately.

## API Documentation

All API responses follow:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {}
}
```

### Auth

`POST /api/auth/register`

```json
{
  "name": "Asha Mehta",
  "email": "asha@example.com",
  "password": "password123",
  "role": "Sales User"
}
```

`POST /api/auth/login`

```json
{
  "email": "asha@example.com",
  "password": "password123"
}
```

`GET /api/auth/me`

Requires `Authorization: Bearer <token>`.

### Leads

`GET /api/leads`

Query parameters:

- `status`: `New`, `Contacted`, `Qualified`, `Lost`
- `source`: `Website`, `Instagram`, `Referral`
- `search`: name or email search
- `sort`: `latest` or `oldest`
- `page`: page number
- `limit`: defaults to `10`

Example:

```text
/api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1&limit=10
```

`POST /api/leads` Admin only

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

`GET /api/leads/:id`

`PATCH /api/leads/:id`

Admin may update all lead fields. Sales users may send only:

```json
{
  "status": "Qualified"
}
```

`DELETE /api/leads/:id` Admin only

`GET /api/leads/export` Admin only, returns `text/csv`.

## Deployment

### MongoDB Atlas

Create a cluster, add a database user, allow your Render backend IP or `0.0.0.0/0` if appropriate for your environment, and copy the connection string into `MONGODB_URI`.

### Render Backend

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI=<atlas-uri>`
  - `JWT_SECRET=<long-random-secret>`
  - `JWT_EXPIRES_IN=7d`
  - `CLIENT_URL=<vercel-frontend-url>`

### Vercel Frontend

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=<render-backend-url>/api`

## Production Notes

- Use a long random `JWT_SECRET`.
- Keep Render `CLIENT_URL` aligned with the deployed Vercel URL for CORS.
- Use Atlas network access rules appropriate to your security posture.
- The backend validates requests with Zod and uses centralized error handling for consistent failures.
