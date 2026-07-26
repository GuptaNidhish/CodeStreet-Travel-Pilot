// ============================================
// Audit & Agent Log Routes
// ============================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const auditRouter = Router();
auditRouter.use(requireAuth);

// GET /api/audit/:tripId
auditRouter.get('/:tripId', async (req: AuthRequest, res: Response) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({ where: { tripId: req.params.tripId }, orderBy: { timestamp: 'asc' } });
    return res.json({ success: true, data: auditLogs });
  } catch { return res.status(500).json({ success: false, error: 'Failed to fetch audit logs' }); }
});

// GET /api/audit/agents/:tripId
auditRouter.get('/agents/:tripId', async (req: AuthRequest, res: Response) => {
  try {
    const agentLogs = await prisma.agentLog.findMany({ where: { tripId: req.params.tripId }, orderBy: { timestamp: 'asc' } });
    return res.json({ success: true, data: agentLogs });
  } catch { return res.status(500).json({ success: false, error: 'Failed to fetch agent logs' }); }
});
