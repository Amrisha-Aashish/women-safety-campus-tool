import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health.routes.js';
import reportsRouter from './routes/reports.routes.js';
import sosAlertsRouter from './routes/sos-alerts.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';


const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/sos-alerts', sosAlertsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
