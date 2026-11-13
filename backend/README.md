# Campus Safety API

Express API for the Community Based Reporting and Monitoring Tool for Women's Safety in Colleges/Universities.

## Run locally

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API starts at `http://localhost:4000`.

## Current endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/reports` | List reports (temporary memory store) |
| POST | `/api/reports` | Submit a safety report |

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

Anonymous reports receive a generated pseudonym. Once Prisma is merged, the report controller should replace the temporary memory store with persistent database queries.
