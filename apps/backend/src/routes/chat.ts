import { Router } from 'express';
import { getDatabase } from '../database/connection';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Create chat session
router.post('/sessions', async (req: AuthRequest, res) => {
  try {
    const { title, model_config } = req.body;
    
    if (!title || !model_config) {
      return res.status(400).json({ error: 'Title and model config are required' });
    }

    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO chat_sessions (user_id, title, model_config) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, model_config, is_pinned, created_at, updated_at`,
      [req.user!.id, title, JSON.stringify(model_config)]
    );

    res.status(201).json({ session: result.rows[0] });
  } catch (error) {
    console.error('Chat session creation error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// List chat sessions
router.get('/sessions', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const result = await db.query(
      `SELECT id, title, model_config, is_pinned, created_at, updated_at 
       FROM chat_sessions 
       WHERE user_id = $1 
       ORDER BY is_pinned DESC, updated_at DESC`,
      [req.user!.id]
    );

    res.json({ sessions: result.rows });
  } catch (error) {
    console.error('Chat sessions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// Get chat session
router.get('/sessions/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const sessionResult = await db.query(
      `SELECT id, title, model_config, is_pinned, created_at, updated_at 
       FROM chat_sessions 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user!.id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const messagesResult = await db.query(
      `SELECT id, role, content, metadata, created_at 
       FROM chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      session: sessionResult.rows[0],
      messages: messagesResult.rows
    });
  } catch (error) {
    console.error('Chat session fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
});

// Update chat session
router.put('/sessions/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, is_pinned, model_config } = req.body;

    const db = getDatabase();
    const result = await db.query(
      `UPDATE chat_sessions 
       SET title = COALESCE($1, title), 
           is_pinned = COALESCE($2, is_pinned),
           model_config = COALESCE($3, model_config),
           updated_at = NOW()
       WHERE id = $4 AND user_id = $5 
       RETURNING id, title, model_config, is_pinned, created_at, updated_at`,
      [title, is_pinned, model_config ? JSON.stringify(model_config) : null, id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    console.error('Chat session update error:', error);
    res.status(500).json({ error: 'Failed to update chat session' });
  }
});

// Delete chat session
router.delete('/sessions/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const db = getDatabase();
    const result = await db.query(
      'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Chat session deletion error:', error);
    res.status(500).json({ error: 'Failed to delete chat session' });
  }
});

// Add message to session
router.post('/sessions/:id/messages', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { role, content, metadata = {} } = req.body;
    
    if (!role || !content) {
      return res.status(400).json({ error: 'Role and content are required' });
    }

    const db = getDatabase();
    
    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [id, req.user!.id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const result = await db.query(
      `INSERT INTO chat_messages (session_id, role, content, metadata) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, role, content, metadata, created_at`,
      [id, role, content, JSON.stringify(metadata)]
    );

    // Update session timestamp
    await db.query(
      'UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1',
      [id]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

export default router;