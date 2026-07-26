// ============================================
// SSE (Server-Sent Events) Route
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { sseManager } from '../lib/sse';
import { v4 as uuidv4 } from 'uuid';

export const sseRouter = Router();

// GET /api/events/stream
sseRouter.get('/stream', requireAuth, (req: AuthRequest, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  const clientId = uuidv4();
  sseManager.addClient(clientId, req.userId!, res);

  const heartbeat = setInterval(() => {
    try { res.write(`: heartbeat\n\n`); } catch { clearInterval(heartbeat); }
  }, 30000);

  req.on('close', () => { clearInterval(heartbeat); sseManager.removeClient(clientId); });
});
