// ============================================
// Notification Routes
// ============================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const notificationRouter = Router();
notificationRouter.use(requireAuth);

// GET /api/notifications
notificationRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' }, take: 50 });
    const unreadCount = await prisma.notification.count({ where: { userId: req.userId!, read: false } });
    return res.json({ success: true, data: { notifications, unreadCount } });
  } catch { return res.status(500).json({ success: false, error: 'Failed to fetch notifications' }); }
});

// PATCH /api/notifications/:id/read
notificationRouter.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    return res.json({ success: true, data: notification });
  } catch { return res.status(500).json({ success: false, error: 'Failed to mark as read' }); }
});

// PATCH /api/notifications/read-all
notificationRouter.patch('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.userId!, read: false }, data: { read: true } });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch { return res.status(500).json({ success: false, error: 'Failed to mark all as read' }); }
});
