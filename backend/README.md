# Campus Safety API

Express API for the Community Based Reporting and Monitoring Tool for Women's Safety in Colleges/Universities.

## Database setup

The API uses PostgreSQL through Prisma. Start a local PostgreSQL database or provision a hosted one, then set `DATABASE_URL` in `backend/.env`. Use the connection string format shown in `.env.example`. Never commit `.env` or a real database credential.

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate -- --name init
```

`db:migrate` creates a development migration and applies it to the configured database. Use `npm run db:deploy` to apply checked-in migrations in a deployment environment. `npm run db:studio` opens Prisma Studio.

## Run locally

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL in .env before starting the API.
npm install
npm run dev
```

The API starts at `http://localhost:4000`.

## Current endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/reports` | List persisted reports |
| POST | `/api/reports` | Persist a safety report |
| GET | `/api/dashboard/summary` | Report and SOS totals, grouped counts, and the five newest reports |

Dashboard summary response shape:

```json
{
  "success": true,
  "data": {
    "totalReports": 1,
    "reportsByCategory": [
      { "category": "UNSAFE_AREA", "count": 1 }
    ],
    "reportsByStatus": [
      { "status": "OPEN", "count": 1 }
    ],
    "totalSosAlerts": 1,
    "activeSosAlerts": 1,
    "recentReports": [
      {
        "id": "report-id",
        "category": "UNSAFE_AREA",
        "status": "OPEN",
        "locationName": "East Gate Walkway",
        "createdAt": "2026-11-14T12:00:00.000Z"
      }
    ]
  }
}
```

Example report payload:

```json
{
  "category": "UNSAFE_AREA",
  "description": "The walkway beside the east gate has no lighting after 7 PM.",
  "location": {
    "name": "East Gate Walkway",
    "latitude": 23.3441,
    "longitude": 85.3096
  },
  "isAnonymous": true
}
```

Anonymous reports receive a generated pseudonym and are stored without a user relation. Non-anonymous reports require an authenticated user to be attached to `request.user`; authentication is not yet implemented in this API, so that mode currently returns `401`.

## Prisma models

The schema defines users, reports, risk zones, alerts, and SOS alerts. Report coordinates and occurrence timestamps are indexed to support later analytics. Run `npm run db:generate` after schema changes and create migrations with `npm run db:migrate -- --name <migration-name>`.
