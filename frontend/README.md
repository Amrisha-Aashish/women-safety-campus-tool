# SafeCampus: frontend

React + Vite frontend for the Community Based Reporting and Monitoring Tool for Women's Safety.

- **UI components:** [glassform](https://www.npmjs.com/package/glassform). Glass is used for navigation and controls (sidebar, top bar, buttons, segmented controls, map overlays, SOS). The solid twins (`Card`, `Table`, `StatCard`, `List`…) are used for content.
- **Layout:** Tailwind CSS v4.
- **Icons:** a small in-house SVG set (`src/components/Icon.jsx` + `src/data/iconPaths.js`).
- **Map:** Leaflet with OpenStreetMap tiles. Leaflet only draws the map; every control on and around it is glassform.

## Run locally

Start the backend first (see `../backend/README.md`), then:

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

In development, Vite proxies every `/api` request to `http://localhost:4000` (see `vite.config.js`). The browser only talks to the Vite server, so the backend's `CLIENT_ORIGIN` setting doesn't matter and any port works (`npx vite --port 5190`).

```bash
npm run build      # production build in dist/
npm run preview    # serve the build
```

### Deploying

- Set `VITE_API_URL` to the backend's address at build time (copy `.env.example` to `.env`), and set the backend's `CLIENT_ORIGIN` to the frontend's address.
- The app uses client-side routing (`BrowserRouter`), so the host must rewrite every path to `index.html`.

## Pages

| Route | Page | API |
| --- | --- | --- |
| `/` | Landing page: project pitch and quick actions for Report, Safety map and SOS | none |
| `/dashboard` | Admin dashboard: total / open / resolved / anonymous, reports by category, red time zones by hour, top black spots, searchable recent reports table | `GET /api/reports` every 10 s |
| `/report` | Report form: category dropdown, description, campus place picker, location name, latitude / longitude, browser location, anonymous toggle, success and error states | `POST /api/reports` |
| `/map` | Safety map: report markers by category, risk zones by level, layer and category filters, black spot list | `GET /api/reports` |
| `/sos` | SOS: large button, confirmation dialog, location capture, sent screen, emergency numbers | not connected yet (see below) |
| `*` | 404 page | none |

The internal pages share a sidebar layout (`src/components/layout/AppLayout.jsx`). On phones the sidebar opens as a drawer from the menu button. The sidebar footer shows whether `GET /api/health` responds.

## Data and placeholders

- **Live / Sample switch** (dashboard and map). *Live* reads `/api/reports`. When the API can't be reached, or *Sample* is picked, 46 seeded sample reports (`src/data/sampleReports.js`) are shown so demos stay meaningful while the backend uses its in-memory store.
- **Black spots and red time zones** are computed in the browser (`src/lib/reportStats.js`). Replace `hotspots()` and `redTimeZones()` with results from the analytics service when it is ready.
- **Form validation** (`src/hooks/useReportForm.js`) mirrors `backend/src/middleware/validate-report.middleware.js`. Keep the two in sync.
- **Campus places** (`src/data/campusPlaces.js`) are example coordinates around the point in the backend README. Swap in the real campus.
- **SOS** has no backend endpoint yet. `src/lib/sos.js` simulates sending, and the sent screen says it is in demo mode. When `POST /api/sos` exists, replace the body of `sendSos()` and set `SOS_CONNECTED = true`.
- **Campus security number** in `src/data/emergencyContacts.js` is still a placeholder.
- **Report status** only shows what the API returns. Marking a report as resolved needs an API endpoint first.

## Folder structure

```
src/
  main.jsx, App.jsx        entry and routes (app pages are lazy-loaded)
  index.css                Tailwind entry, design tokens, glassform theme, Leaflet styles
  pages/                   one file per route
  components/
    landing/               landing page sections
    layout/                app layout, sidebar, top bar, mobile drawer, API status
    app/                   shared app pieces (Live/Sample data bar)
    dashboard/             stat cards, category, time zones, black spots, reports table
    report/                report form parts and result
    map/                   Leaflet map, legend, filters, black spot list
    sos/                   SOS button, dialog, location, result, contacts, tips
    Icon.jsx, Logo.jsx
  hooks/                   useReports, useReportForm, useGeolocation, useApiHealth
  lib/                     api client, report analytics, formatting, SOS
  data/                    categories, campus places, sample reports, navigation, copy
```
