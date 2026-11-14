import { Router } from 'express';
import {
  getRedTimeZones,
  getRiskZones
} from '../controllers/analytics.controller.js';

const router = Router();

router.get('/risk-zones', getRiskZones);
router.get('/red-time-zones', getRedTimeZones);

export default router;