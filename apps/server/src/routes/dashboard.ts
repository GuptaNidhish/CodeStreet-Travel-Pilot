// ============================================
// Manager Dashboard Routes
// ============================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

// GET /api/dashboard/manager
dashboardRouter.get('/manager', requireRole('MANAGER'), async (_req: AuthRequest, res: Response) => {
  try {
    const [totalTrips, activeTrips, delayedTrips, cancelledTrips, autoResolved, pendingApproval, escalated, allDecisions, recentAudit, tripsByStatus] = await Promise.all([
      prisma.trip.count(),
      prisma.trip.count({ where: { status: 'ACTIVE' } }),
      prisma.trip.count({ where: { status: 'DISRUPTED' } }),
      prisma.trip.count({ where: { status: 'CANCELLED' } }),
      prisma.rebookingDecision.count({ where: { status: 'AUTO_BOOKED' } }),
      prisma.rebookingDecision.count({ where: { status: 'AWAITING_APPROVAL' } }),
      prisma.rebookingDecision.count({ where: { status: 'ESCALATED' } }),
      prisma.rebookingDecision.findMany({ where: { status: { in: ['AUTO_BOOKED', 'APPROVED'] } }, select: { fareDelta: true } }),
      prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 20 }),
      prisma.trip.groupBy({ by: ['status'], _count: { status: true } }),
    ]);

    const totalSavingsUSD = allDecisions.reduce((sum: number, d: { fareDelta: number }) => sum + Math.max(0, -d.fareDelta), 0);

    return res.json({
      success: true,
      data: {
        totalTrips, activeTrips, delayedTrips, cancelledTrips,
        autoResolved, pendingApproval, escalated,
        totalSavingsUSD: Math.round(totalSavingsUSD),
        avgResolutionTimeMs: 4500,
        riskScoreDistribution: [{ score: 10, count: 5 }, { score: 30, count: 12 }, { score: 50, count: 8 }, { score: 70, count: 6 }, { score: 90, count: 3 }],
        recentActivity: recentAudit,
        tripsByStatus: tripsByStatus.map((t: { status: any; _count: { status: number } }) => ({ status: t.status, count: t._count.status })),
        carbonSavedKg: 245,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch dashboard' });
  }
});

// GET /api/dashboard/manager/trips
dashboardRouter.get('/manager/trips', requireRole('MANAGER'), async (_req: AuthRequest, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({
      include: { user: { select: { name: true, email: true } }, segments: true, disruptions: true, decisions: true },
      orderBy: { updatedAt: 'desc' },
    });
    return res.json({ success: true, data: trips });
  } catch { return res.status(500).json({ success: false, error: 'Failed to fetch trips' }); }
});
