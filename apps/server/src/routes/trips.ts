// ============================================
// Trip Routes — CRUD for Trips with Segments
// ============================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const tripRouter = Router();
tripRouter.use(requireAuth);

// POST /api/trips
tripRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, budgetUSD, segments, hotelBookings, cabBookings } = req.body;

    const trip = await prisma.trip.create({
      data: {
        userId: req.userId!,
        title, description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budgetUSD: budgetUSD || 0,
        segments: {
          create: (segments || []).map((s: any) => ({
            flightNumber: s.flightNumber, airline: s.airline,
            departureAirport: s.departureAirport, arrivalAirport: s.arrivalAirport,
            departureTime: new Date(s.departureTime), arrivalTime: new Date(s.arrivalTime),
            cabin: s.cabin || 'ECONOMY', fare: s.fare, pnr: s.pnr,
            order: s.order || 0, carbonKg: s.carbonKg || Math.round(1500 * 0.255),
          })),
        },
        hotelBookings: {
          create: (hotelBookings || []).map((h: any) => ({
            hotelName: h.hotelName, location: h.location,
            checkIn: new Date(h.checkIn), checkOut: new Date(h.checkOut),
            pricePerNight: h.pricePerNight,
            totalPrice: h.pricePerNight * Math.ceil((new Date(h.checkOut).getTime() - new Date(h.checkIn).getTime()) / 86400000),
            confirmationCode: `HC-${Date.now().toString(36).toUpperCase()}`,
          })),
        },
        cabBookings: {
          create: (cabBookings || []).map((c: any) => ({
            pickupLocation: c.pickupLocation, dropoffLocation: c.dropoffLocation,
            scheduledTime: new Date(c.scheduledTime), price: c.price,
            provider: c.provider || 'Mock Cabs',
          })),
        },
      },
      include: { segments: { orderBy: { order: 'asc' } }, hotelBookings: true, cabBookings: true },
    });

    return res.status(201).json({ success: true, data: trip });
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create trip' });
  }
});

// GET /api/trips
tripRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const where = req.userRole === 'MANAGER' ? {} : { userId: req.userId! };
    const trips = await prisma.trip.findMany({
      where,
      include: { segments: { orderBy: { order: 'asc' } }, disruptions: true, decisions: true },
      orderBy: { startDate: 'asc' },
    });
    return res.json({ success: true, data: trips });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch trips' });
  }
});

// GET /api/trips/:id
tripRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.id },
      include: {
        segments: { orderBy: { order: 'asc' } },
        hotelBookings: true, cabBookings: true,
        disruptions: { include: { candidates: true }, orderBy: { detectedAt: 'desc' } },
        decisions: { include: { selectedCandidate: true }, orderBy: { decidedAt: 'desc' } },
        notifications: { orderBy: { createdAt: 'desc' } },
        auditLogs: { orderBy: { timestamp: 'desc' } },
        agentLogs: { orderBy: { timestamp: 'asc' } },
      },
    });
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
    return res.json({ success: true, data: trip });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch trip' });
  }
});

// DELETE /api/trips/:id
tripRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.trip.deleteMany({ where: { id: req.params.id, userId: req.userId! } });
    return res.json({ success: true, message: 'Trip deleted' });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to delete trip' });
  }
});
