# SafeCampus: frontend

React + Vite frontend for the Community Based Reporting and Monitoring Tool for Women's Safety.

- **UI components:** [glassform](https://www.npmjs.com/package/glassform). Glass is used for navigation and controls (sidebar, top bar, buttons, segmented controls, map overlays, SOS). The solid twins (`Card`, `Table`, `StatCard`, `List`…) are used for content.
- **Layout:** Tailwind CSS v4.
- **Icons:** a small in-house SVG set (`src/components/Icon.jsx` + `src/data/iconPaths.js`).
- **Themes:** dark by default, with a light/dark toggle in every page toolbar and the landing header. The choice is saved in `localStorage` and applied before the first paint (`index.html`, `src/lib/theme.js`). The light theme flips the colour scales in `src/index.css`; elements marked `.dark` (hero, privacy band, SOS panel) stay dark in both; the sidebar follows the theme.
- **Map:** OpenStreetMap street tiles cut to the campus boundary, with labels, risk zones and report dots drawn on top as SVG (`src/components/map/CampusMap.jsx`). No map library: tiles are placed with the Web Mercator maths in `src/lib/campusGeo.js`.

## Run locally

Start the backend first (see `../backend/README.md`), then:

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

In development, Vite proxies every `/api` request to `http://localhost:4000` (see `vite.config.js`). The browser only talks to the Vite server, so the backend's `CLIENT_ORIGIN` setting doesn't matter and any port works (`npx vite --port 5190`). To use a backend somewhere else, set `API_PROXY_TARGET`:

```bash
API_PROXY_TARGET=http://localhost:4100 npm run dev
```

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
| `/dashboard` | Admin dashboard: total / open / resolved / anonymous, SOS alert status with open alerts, risk zones (placeholder), reports by category, red time zones by hour, top black spots, searchable recent reports table | `GET /api/reports` every 10 s, `GET /api/sos-alerts` every 5 s |
| `/report` | Report form: category dropdown, description, campus place picker, location name, latitude / longitude (must be on campus), browser location, anonymous toggle, success and error states | `POST /api/reports` |
| `/map` | Street map of the campus only: report dots by category (click for details), risk zones by level, layer and category filters, black spot list | `GET /api/reports` + map tiles |
| `/sos-alerts` | Admin SOS alerts: counts per status, average time to resolve, status filter (opens on Active), one card per alert with nearest campus place, coordinates, time, Acknowledge / Resolve; a toast announces each new alert | `GET /api/sos-alerts` every 5 s, `PATCH /api/sos-alerts/:id/acknowledge`, `PATCH /api/sos-alerts/:id/resolve` |
| `/sos` | SOS: large button, confirmation dialog, location capture, sent screen with live progress (sent → security on the way → resolved), emergency numbers | `POST /api/sos-alerts`, then `GET /api/sos-alerts` every 5 s |
| `*` | 404 page | none |

The internal pages share a sidebar layout (`src/components/layout/AppLayout.jsx`). On phones the sidebar opens as a drawer from the menu button. The sidebar footer shows whether `GET /api/health` responds.

## Map tiles

The map loads the 25 OpenStreetMap tiles (zoom 18) that cover the campus. They are free with the attribution shown on the map; for heavy public traffic, check the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/) or switch to a provider with an API key by changing `STREET_TILES` in `src/lib/campusGeo.js`.

## Data and placeholders

- **Live / Sample switch** (dashboard, map and SOS alerts). *Live* reads the API. When the API can't be reached, or *Sample* is picked, sample data is shown so demos stay meaningful: 46 seeded reports (`src/data/sampleReports.js`) and 7 SOS alerts (`src/data/sampleSosAlerts.js`). On sample data, Acknowledge / Resolve only change the alert in the browser.
- **Black spots and red time zones** are computed in the browser (`src/lib/reportStats.js`). Replace `hotspots()` and `redTimeZones()` with results from the analytics service when it is ready.
- **Form validation** (`src/hooks/useReportForm.js`) mirrors `backend/src/middleware/validate-report.middleware.js`. Keep the two in sync.
- **Campus:** Ajeenkya DY Patil University, Lohegaon, Pune. The boundary in `src/data/campusPlaces.js` is the university outline from OpenStreetMap (way 1410120541), and the places are real OpenStreetMap features; the ones marked “unnamed in OSM” got descriptive names, so rename them to what students call them. Reports must fall inside `CAMPUS_BOUNDARY`: the form checks it, and the backend enforces the same polygon in `backend/src/config/campus.js`, so keep the two identical. The map is drawn from the same boundary.
- **SOS without a location.** `POST /api/sos-alerts` requires coordinates, so when the browser can't share a position `src/lib/sos.js` sends the campus centre and the student is told to give their location when they call. The admin can't tell these alerts apart yet; a `locationShared` flag (or nullable coordinates) on `SOSAlert` would fix that.
- **SOS status for the student** is found by polling `GET /api/sos-alerts` and picking the alert by id (`src/hooks/useSosAlertStatus.js`). Switch to a single-alert endpoint when one exists.
- **Risk zones** on the dashboard are placeholders (`src/data/sampleRiskZones.js`), shaped like the backend's `RiskZone` model. Pass the API's zones to `RiskZonesCard` with `placeholder={false}` once an endpoint exists.
- **Campus security number** in `src/data/emergencyContacts.js` is still a placeholder.
- **Report status** only shows what the API returns. Marking a report as resolved needs an API endpoint first.

## Folder structure

```
src/
  main.jsx, App.jsx        entry and routes (app pages are lazy-loaded)
  index.css                Tailwind entry, design tokens, dark glassform theme
  pages/                   one file per route
  components/
    landing/               landing page sections
    layout/                app layout, sidebar, top bar, mobile drawer, API status
    app/                   shared app pieces (Live/Sample data bar)
    dashboard/             stat cards, SOS status, risk zones, category, time zones, black spots, reports table
    sos-alerts/            SOS alert card and summary counters
    report/                report form parts and result
    map/                   SVG campus map, report detail, legend, filters, black spot list
    sos/                   SOS button, dialog, location, result, contacts, tips
    Icon.jsx, Logo.jsx
  hooks/                   useReports, useSosAlerts, useSosAlertStatus, useNewSosAlert, useReportForm, useGeolocation, useApiHealth
  lib/                     api client, campus geometry, report and SOS stats, formatting, SOS sending
  data/                    categories, SOS statuses, campus places, sample reports / SOS alerts / risk zones, navigation, copy
```
