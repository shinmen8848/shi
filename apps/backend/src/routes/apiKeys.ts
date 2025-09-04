import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/connection';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Generate API key
function generateApiKey(): string {
  return 'sk-' + crypto.randomBytes(32).toString('hex');
}

// Create API key
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, permissions = {}, expiresIn } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'API key name is required' });
    }

    const apiKey = generateApiKey();
    const keyHash = await bcrypt.hash(apiKey, 12);
    const keyPreview = apiKey.substring(0, 7) + '...' + apiKey.substring(apiKey.length - 4);
    
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000); // days to milliseconds
    }

    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO api_keys (user_id, name, key_hash, key_preview, permissions, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, key_preview, permissions, usage_count, expires_at, is_active, created_at`,
      [req.user!.id, name, keyHash, keyPreview, JSON.stringify(permissions), expiresAt]
    );

    const apiKeyData = result.rows[0];

    res.status(201).json({
      ...apiKeyData,
      key: apiKey // Only return the actual key once during creation
    });
  } catch (error) {
    console.error('API key creation error:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// List API keys
router.get('/', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const result = await db.query(
      `SELECT id, name, key_preview, permissions, usage_count, last_used_at, expires_at, is_active, created_at 
       FROM api_keys 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user!.id]
    );

    res.json({ apiKeys: result.rows });
  } catch (error) {
    console.error('API keys fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Update API key
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, permissions, is_active } = req.body;

    const db = getDatabase();
    const result = await db.query(
      `UPDATE api_keys 
       SET name = COALESCE($1, name), 
           permissions = COALESCE($2, permissions), 
           is_active = COALESCE($3, is_active)
       WHERE id = $4 AND user_id = $5 
       RETURNING id, name, key_preview, permissions, usage_count, last_used_at, expires_at, is_active, created_at`,
      [name, permissions ? JSON.stringify(permissions) : null, is_active, id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ apiKey: result.rows[0] });
  } catch (error) {
    console.error('API key update error:', error);
    res.status(500).json({ error: 'Failed to update API key' });
  }
});

// Delete API key
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const db = getDatabase();
    const result = await db.query(
      'DELETE FROM api_keys WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('API key deletion error:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// Validate API key (for internal use)
export async function validateApiKey(apiKey: string): Promise<{ userId: string; keyId: string } | null> {
  try {
    const db = getDatabase();
    const result = await db.query(
      `SELECT id, user_id, key_hash, is_active, expires_at 
       FROM api_keys 
       WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())`,
    );

    for (const row of result.rows) {
      const isValid = await bcrypt.compare(apiKey, row.key_hash);
      if (isValid) {
        // Update usage count and last used
        await db.query(
          'UPDATE api_keys SET usage_count = usage_count + 1, last_used_at = NOW() WHERE id = $1',
          [row.id]
        );
        
        return { userId: row.user_id, keyId: row.id };
      }
    }

    return null;
  } catch (error) {
    console.error('API key validation error:', error);
    return null;
  }
}

export default router;