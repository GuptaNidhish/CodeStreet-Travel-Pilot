// ============================================
// TravelPilot AI — Express Server Entry Point
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { tripRouter } from './routes/trips';
import { flightRouter } from './routes/flights';
import { disruptionRouter } from './routes/disruptions';
import { rebookRouter } from './routes/rebook';
import { notificationRouter } from './routes/notifications';
import { dashboardRouter } from './routes/dashboard';
import { auditRouter } from './routes/audit';
import { sseRouter } from './routes/sse';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TravelPilot AI', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/trips', tripRouter);
app.use('/api/flights', flightRouter);
app.use('/api/disruptions', disruptionRouter);
app.use('/api/rebook', rebookRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/audit', auditRouter);
app.use('/api/events', sseRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected via Supabase');
    
    app.listen(PORT, () => {
      console.log(`🚀 TravelPilot AI server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
