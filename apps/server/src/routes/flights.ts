// ============================================
// Flight Status Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getFlightStatus } from '../integrations/flightStatus';

export const flightRouter = Router();
flightRouter.use(requireAuth);

// GET /api/flights/status/:flightNumber
flightRouter.get('/status/:flightNumber', async (req: AuthRequest, res: Response) => {
  try {
    const status = await getFlightStatus(req.params.flightNumber);
    return res.json({ success: true, data: status });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to get flight status' });
  }
});
