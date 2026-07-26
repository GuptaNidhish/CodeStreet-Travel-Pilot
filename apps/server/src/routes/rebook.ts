// ============================================
// Rebook Routes — Approve, Override, Undo
// ============================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { sseManager } from '../lib/sse';
import { SSEEventType } from '@travelpilot/shared';

export const rebookRouter = Router();
rebookRouter.use(requireAuth);

// POST /api/rebook/approve/:decisionId
rebookRouter.post('/approve/:decisionId', async (req: AuthRequest, res: Response) => {
  try {
    const decision = await prisma.rebookingDecision.findUnique({
      where: { id: req.params.decisionId }, include: { selectedCandidate: true, trip: true },
    });
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });
    if (decision.status !== 'AWAITING_APPROVAL') return res.status(400).json({ success: false, error: `Decision is already ${decision.status}` });

    const updated = await prisma.rebookingDecision.update({
      where: { id: decision.id }, data: { status: 'APPROVED', executedAt: new Date() }, include: { selectedCandidate: true },
    });

    await prisma.auditLog.create({ data: { tripId: decision.tripId, agentType: 'EXECUTION', action: 'BOOKING_APPROVED', input: { decisionId: decision.id }, output: { candidateId: decision.selectedCandidateId }, reasoning: 'Traveler approved the recommended rebooking option.', durationMs: 0 } });
    await prisma.notification.create({ data: { userId: decision.trip.userId, tripId: decision.tripId, type: 'BOOKING_CONFIRMED', title: 'Rebooking Confirmed', message: `Your flight has been rebooked to ${updated.selectedCandidate?.flightNumber || 'new flight'}.`, channel: 'IN_APP' } });
    sseManager.sendToUser(decision.trip.userId, SSEEventType.BOOKING_CONFIRMED, { decisionId: decision.id, tripId: decision.tripId, status: 'APPROVED' });

    return res.json({ success: true, data: updated, message: 'Rebooking approved successfully' });
  } catch { return res.status(500).json({ success: false, error: 'Failed to approve rebooking' }); }
});

// POST /api/rebook/override/:decisionId
rebookRouter.post('/override/:decisionId', async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId } = req.body;
    const decision = await prisma.rebookingDecision.findUnique({ where: { id: req.params.decisionId }, include: { trip: true } });
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });

    const updated = await prisma.rebookingDecision.update({
      where: { id: decision.id }, data: { status: 'OVERRIDDEN', selectedCandidateId: candidateId, executedAt: new Date() }, include: { selectedCandidate: true },
    });

    await prisma.auditLog.create({ data: { tripId: decision.tripId, agentType: 'EXECUTION', action: 'BOOKING_OVERRIDDEN', input: { decisionId: decision.id, newCandidateId: candidateId }, output: { status: 'OVERRIDDEN' }, reasoning: 'Traveler chose a different rebooking option.', durationMs: 0 } });
    sseManager.sendToUser(decision.trip.userId, SSEEventType.BOOKING_CONFIRMED, { decisionId: decision.id, tripId: decision.tripId, status: 'OVERRIDDEN' });

    return res.json({ success: true, data: updated, message: 'Override applied' });
  } catch { return res.status(500).json({ success: false, error: 'Failed to override decision' }); }
});

// POST /api/rebook/undo/:decisionId
rebookRouter.post('/undo/:decisionId', async (req: AuthRequest, res: Response) => {
  try {
    const decision = await prisma.rebookingDecision.findUnique({ where: { id: req.params.decisionId }, include: { trip: true } });
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });
    if (decision.undoDeadline && new Date() > decision.undoDeadline) return res.status(400).json({ success: false, error: 'Undo window has expired' });
    if (!['AUTO_BOOKED', 'APPROVED'].includes(decision.status)) return res.status(400).json({ success: false, error: `Cannot undo ${decision.status}` });

    const updated = await prisma.rebookingDecision.update({ where: { id: decision.id }, data: { status: 'UNDONE' } });
    await prisma.auditLog.create({ data: { tripId: decision.tripId, agentType: 'EXECUTION', action: 'BOOKING_UNDONE', input: { decisionId: decision.id }, output: { status: 'UNDONE' }, reasoning: 'Traveler undid auto-booking within undo window.', durationMs: 0 } });
    await prisma.notification.create({ data: { userId: decision.trip.userId, tripId: decision.tripId, type: 'UNDO_AVAILABLE', title: 'Booking Undone', message: 'Your recent rebooking has been cancelled. The original booking stands.', channel: 'IN_APP' } });

    return res.json({ success: true, data: updated, message: 'Rebooking undone successfully' });
  } catch { return res.status(500).json({ success: false, error: 'Failed to undo rebooking' }); }
});
