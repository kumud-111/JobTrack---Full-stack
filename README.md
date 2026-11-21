# JobTrack — Full-Stack Job Application Tracker

A responsive job application tracker built with React + TypeScript and a Node.js + Express + TypeScript REST API. Application data is stored in SQLite using Prisma ORM.

## Features
- Dashboard cards for total applications, active applications, interviews and offers.
- Application pipeline: Wishlist, Applied, Interview, Offer and Rejected.
- Create, view, edit and delete applications.
- Search by company, role or location; filter by status.
- Save job URL, application date, follow-up date and notes.
- Update application status directly from the dashboard.
- Responsive desktop and mobile layout.
- Zod request validation and centralized API error handling.

## Tech stack
Frontend: React, TypeScript, Vite, CSS, Lucide React  
Backend: Node.js, Express.js, TypeScript, Zod  
Database: SQLite, Prisma ORM  
API testing: Postman

## Run locally
Requirements: Node.js 20+ and npm.

### Backend
```bash
cd backend
npm install
```
Create `.env` by copying `.env.example` (PowerShell: `Copy-Item .env.example .env`; macOS/Linux: `cp .env.example .env`).
```bash
npx prisma migrate dev --name init
npm run dev
```
API: `http://localhost:4000`  
Health check: `http://localhost:4000/api/health`

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
```
Create `.env` from `.env.example`. The default API URL is `http://localhost:4000`.
```bash
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## API routes
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | API health |
| POST | `/api/applications` | Create |
| GET | `/api/applications` | List/search/filter |
| GET | `/api/applications/:id` | Get one |
| PATCH | `/api/applications/:id` | Update |
| DELETE | `/api/applications/:id` | Delete |
| GET | `/api/stats` | Dashboard counts |

Statuses: `WISHLIST`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`.

## Postman
Import `postman/JobTrack.postman_collection.json`. Start the backend before running requests. The Create request saves its returned ID in the collection variable for later requests.

## Deployment overview
Deploy as two services:
1. Backend: deploy the `backend` folder as a Node web service. Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`. Start command: `npm start`. Configure `DATABASE_URL`, `PORT` (usually supplied by host), and `FRONTEND_URL`.
2. Frontend: deploy the `frontend` folder as a Vite static site. Build command: `npm install && npm run build`. Output directory: `dist`. Set `VITE_API_URL` to the deployed backend base URL (no trailing slash).
3. Set backend `FRONTEND_URL` to the deployed frontend origin and redeploy the backend.

**Persistence warning:** SQLite is convenient for local development. Some free cloud services use temporary filesystems, so SQLite data can be lost after restarts or redeploys. For a durable public demo, use managed PostgreSQL and update the Prisma datasource/schema and database URL, or use a host with a persistent disk. Do not claim persistent cloud storage unless you configure it.

## Before adding this to a resume
Run the app, test create/edit/delete/search/status flows, add screenshots, and make sure you can explain the React state, API routes, Prisma model and validation. This starter does not include login, JWT, automated test coverage or a cloud deployment unless you add and verify those features.
