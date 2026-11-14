import { Router } from 'express';
import { createReport, listReports } from '../controllers/reports.controller.js';
import { validateCreateReport } from '../middleware/validate-report.middleware.js';

const router = Router();

router.get('/', listReports);
router.post('/', validateCreateReport, createReport);

export default router;
