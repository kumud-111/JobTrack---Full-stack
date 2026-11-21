# JobTrack — Full-Stack Job Application Tracker

A modern job application tracking dashboard designed to help job seekers organize, monitor, and manage their job search journey from one place.

## Overview

JobTrack helps users keep track of job applications, manage application progress, schedule follow-ups, and stay organized throughout their job search.

## Features

- 📊 Dashboard with application statistics
- 📋 Application pipeline: Wishlist, Applied, Interview, Offer, Rejected
- ➕ Add new job applications
- ✏️ Edit application details
- 🗑️ Delete applications
- 🔎 Search by company, role, or location
- 🔄 Update application status
- 📅 Track application dates and follow-ups
- 📝 Save notes and job links
- 📱 Responsive design

## Tech Stack

**Frontend:** React, TypeScript, Vite, CSS, Lucide React  
**Backend:** Node.js, Express.js, TypeScript, Zod  
**Database:** SQLite, Prisma ORM  
**API Testing:** Postman

## Project Structure

```text
JobTrack/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── postman/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd JobTrack-Full-Stack
```

### Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and configure your environment variables.

```bash
npx prisma migrate dev --name init
npm run dev
```

### Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/applications` | Fetch applications |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/:id` | Fetch single application |
| PATCH | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| GET | `/api/stats` | Fetch dashboard statistics |

## Application Statuses

- Wishlist
- Applied
- Interview
- Offer
- Rejected

## Future Improvements

- User authentication
- Cloud database integration
- Email reminders for follow-ups
- Analytics and reporting
- Deployment with production database

## Author

**Kumud Lodhi**

⭐ If you find this project useful, consider giving it a star.
