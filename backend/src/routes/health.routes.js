import { Router } from 'express';

const router = Router();

router.get('/', (_request, response) => {
  response.status(200).json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString() }
  });
});

export default router;
