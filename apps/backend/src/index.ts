import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

import { connectDatabase } from './database/connection';
import { connectRedis } from './config/redis';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import apiKeyRoutes from './routes/apiKeys';
import chatRoutes from './routes/chat';
import ideRoutes from './routes/ide';

// WebSocket
import { setupWebSocket } from './websocket/handler';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/keys', authMiddleware, apiKeyRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/ide', authMiddleware, ideRoutes);

// Error handling
app.use(errorHandler);

// WebSocket setup
setupWebSocket(wss);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    
    server.listen(PORT, () => {
      console.log(`🚀 Shinmen Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();