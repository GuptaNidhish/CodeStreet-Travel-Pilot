// ============================================
// SSE (Server-Sent Events) Manager
// Manages connected clients and broadcasts real-time events
// ============================================

import { Response } from 'express';
import { SSEEventType } from '@travelpilot/shared';

interface SSEClient {
  id: string;
  userId: string;
  res: Response;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();

  addClient(id: string, userId: string, res: Response) {
    this.clients.set(id, { id, userId, res });
    res.on('close', () => this.clients.delete(id));
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  broadcast(type: SSEEventType, data: Record<string, unknown>) {
    const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
    this.clients.forEach((client) => {
      try { client.res.write(payload); } catch { this.clients.delete(client.id); }
    });
  }

  sendToUser(userId: string, type: SSEEventType, data: Record<string, unknown>) {
    const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
    this.clients.forEach((client) => {
      if (client.userId === userId) {
        try { client.res.write(payload); } catch { this.clients.delete(client.id); }
      }
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();
