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
    const flightNum = Array.isArray(req.params.flightNumber) ? req.params.flightNumber[0] : req.params.flightNumber;
    const status = await getFlightStatus(flightNum);
    return res.json({ success: true, data: status });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to get flight status' });
  }
});
