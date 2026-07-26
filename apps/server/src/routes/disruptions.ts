// ============================================
// Disruption Routes — Simulate & View
// ============================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { runDisruptionPipeline } from '../agents/orchestrator';
import { sseManager } from '../lib/sse';
import { SSEEventType } from '@travelpilot/shared';

export const disruptionRouter = Router();
disruptionRouter.use(requireAuth);

// POST /api/disruptions/simulate — The demo trick (Section 17)
disruptionRouter.post('/simulate', async (req: AuthRequest, res: Response) => {
  try {
    const { tripId, segmentId, type, delayMinutes, reason } = req.body;
    if (!tripId || !segmentId || !type) {
      return res.status(400).json({ success: false, error: 'tripId, segmentId, and type are required' });
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId },
      include: { segments: true, user: true },
    });
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

    const segment = trip.segments.find(s => s.id === segmentId);
    if (!segment) return res.status(404).json({ success: false, error: 'Segment not found' });

    const disruption = await prisma.disruptionEvent.create({
      data: {
        tripId, segmentId, type,
        delayMinutes: delayMinutes || (type === 'CANCELLATION' ? 0 : 120),
        reason: reason || `Simulated ${type.toLowerCase()} for demo`,
        riskScore: type === 'CANCELLATION' ? 100 : Math.min(95, 50 + (delayMinutes || 120) * 0.3),
        weatherData: type === 'WEATHER' ? { temperature: 2, condition: 'Heavy Snow', windSpeed: 45, visibility: 200, severity: 'SEVERE' } : null,
      },
    });

    await prisma.segment.update({ where: { id: segmentId }, data: { status: type === 'CANCELLATION' ? 'CANCELLED' : 'DELAYED' } });
    await prisma.trip.update({ where: { id: tripId }, data: { status: 'DISRUPTED' } });

    sseManager.sendToUser(trip.userId, SSEEventType.DISRUPTION_DETECTED, {
      disruptionId: disruption.id, tripId, segmentId, type,
      flightNumber: segment.flightNumber, reason: disruption.reason, riskScore: disruption.riskScore,
    });

    // Run agent pipeline asynchronously
    runDisruptionPipeline(disruption.id, tripId, trip.userId).catch(err => console.error('Agent pipeline error:', err));

    return res.status(201).json({
      success: true, data: disruption,
      message: `Disruption simulated: ${type} on ${segment.flightNumber}. Agents are now processing...`,
    });
  } catch (error) {
    console.error('Simulate disruption error:', error);
    return res.status(500).json({ success: false, error: 'Failed to simulate disruption' });
  }
});

// GET /api/disruptions/:tripId
disruptionRouter.get('/:tripId', async (req: AuthRequest, res: Response) => {
  try {
    const disruptions = await prisma.disruptionEvent.findMany({
      where: { tripId: req.params.tripId },
      include: { segment: true, candidates: { orderBy: { score: 'desc' } }, decisions: { include: { selectedCandidate: true } } },
      orderBy: { detectedAt: 'desc' },
    });
    return res.json({ success: true, data: disruptions });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch disruptions' });
  }
});
