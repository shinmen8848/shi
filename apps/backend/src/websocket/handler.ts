import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { getRedis } from '../config/redis';

interface WebSocketClient extends WebSocket {
  userId?: string;
  sessionId?: string;
}

const clients = new Map<string, WebSocketClient>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', async (ws: WebSocketClient, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'auth':
            await handleAuth(ws, message.payload);
            break;
          case 'join_chat':
            await handleJoinChat(ws, message.payload);
            break;
          case 'chat_message':
            await handleChatMessage(ws, message.payload);
            break;
          case 'ide_collaboration':
            await handleIdeCollaboration(ws, message.payload);
            break;
          default:
            ws.send(JSON.stringify({ type: 'error', payload: { message: 'Unknown message type' } }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', payload: { message: 'Invalid message format' } }));
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected`);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

async function handleAuth(ws: WebSocketClient, payload: { token: string }) {
  try {
    const decoded = jwt.verify(payload.token, process.env.JWT_SECRET!) as { userId: string };
    ws.userId = decoded.userId;
    clients.set(decoded.userId, ws);
    
    ws.send(JSON.stringify({ 
      type: 'auth_success', 
      payload: { userId: decoded.userId } 
    }));
  } catch (error) {
    ws.send(JSON.stringify({ 
      type: 'auth_error', 
      payload: { message: 'Invalid token' } 
    }));
  }
}

async function handleJoinChat(ws: WebSocketClient, payload: { sessionId: string }) {
  if (!ws.userId) {
    ws.send(JSON.stringify({ 
      type: 'error', 
      payload: { message: 'Not authenticated' } 
    }));
    return;
  }

  ws.sessionId = payload.sessionId;
  
  // Store session membership in Redis
  const redis = getRedis();
  await redis.sAdd(`chat_session:${payload.sessionId}:members`, ws.userId);
  
  ws.send(JSON.stringify({ 
    type: 'chat_joined', 
    payload: { sessionId: payload.sessionId } 
  }));
}

async function handleChatMessage(ws: WebSocketClient, payload: any) {
  if (!ws.userId || !ws.sessionId) {
    ws.send(JSON.stringify({ 
      type: 'error', 
      payload: { message: 'Not authenticated or not in a chat session' } 
    }));
    return;
  }

  // Broadcast to all members of the chat session
  const redis = getRedis();
  const members = await redis.sMembers(`chat_session:${ws.sessionId}:members`);
  
  const message = {
    type: 'chat_message',
    payload: {
      ...payload,
      userId: ws.userId,
      timestamp: new Date().toISOString()
    }
  };

  members.forEach(memberId => {
    const client = clients.get(memberId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function handleIdeCollaboration(ws: WebSocketClient, payload: any) {
  if (!ws.userId) {
    ws.send(JSON.stringify({ 
      type: 'error', 
      payload: { message: 'Not authenticated' } 
    }));
    return;
  }

  // Handle IDE collaboration events (cursor position, file changes, etc.)
  const message = {
    type: 'ide_collaboration',
    payload: {
      ...payload,
      userId: ws.userId,
      timestamp: new Date().toISOString()
    }
  };

  // Broadcast to all connected clients (for now, can be refined to project-specific)
  clients.forEach((client, userId) => {
    if (userId !== ws.userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

export function broadcastToUser(userId: string, message: any) {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  }
}