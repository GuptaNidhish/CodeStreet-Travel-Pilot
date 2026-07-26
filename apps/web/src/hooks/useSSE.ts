// ============================================
// SSE (Server-Sent Events) Hook for real-time updates
// ============================================

import { useEffect } from 'react';
import { SSEEvent } from '@travelpilot/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function useSSE(onEvent: (event: SSEEvent) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const eventSource = new EventSource(`${API_BASE_URL}/events/stream?token=${token}`);

    eventSource.onmessage = (e) => {
      try {
        const parsed: SSEEvent = JSON.parse(e.data);
        onEvent(parsed);
      } catch (err) {
        // Silent parse guard
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [onEvent]);
}
