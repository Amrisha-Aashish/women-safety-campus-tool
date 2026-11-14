import { Router } from 'express';
import {
  acknowledgeSosAlert,
  createSosAlert,
  listSosAlerts,
  resolveSosAlert
} from '../controllers/sos-alerts.controller.js';
import { validateCreateSosAlert } from '../middleware/validate-sos-alert.middleware.js';

const router = Router();

router.get('/', listSosAlerts);
router.post('/', validateCreateSosAlert, createSosAlert);
router.patch('/:id/acknowledge', acknowledgeSosAlert);
router.patch('/:id/resolve', resolveSosAlert);

export default router;
