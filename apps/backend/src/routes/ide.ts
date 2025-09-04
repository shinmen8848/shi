import { Router } from 'express';
import { getDatabase } from '../database/connection';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Create IDE project
router.post('/projects', async (req: AuthRequest, res) => {
  try {
    const { name, description, files = {}, settings = {} } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO ide_projects (user_id, name, description, files, settings) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, description, files, settings, is_public, created_at, updated_at`,
      [req.user!.id, name, description, JSON.stringify(files), JSON.stringify(settings)]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    console.error('IDE project creation error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// List IDE projects
router.get('/projects', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const result = await db.query(
      `SELECT id, name, description, is_public, created_at, updated_at 
       FROM ide_projects 
       WHERE user_id = $1 
       ORDER BY updated_at DESC`,
      [req.user!.id]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('IDE projects fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get IDE project
router.get('/projects/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = await db.query(
      `SELECT id, name, description, files, settings, is_public, created_at, updated_at 
       FROM ide_projects 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('IDE project fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update IDE project
router.put('/projects/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, files, settings, is_public } = req.body;

    const db = getDatabase();
    const result = await db.query(
      `UPDATE ide_projects 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           files = COALESCE($3, files),
           settings = COALESCE($4, settings),
           is_public = COALESCE($5, is_public),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7 
       RETURNING id, name, description, files, settings, is_public, created_at, updated_at`,
      [
        name, 
        description, 
        files ? JSON.stringify(files) : null,
        settings ? JSON.stringify(settings) : null,
        is_public,
        id, 
        req.user!.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('IDE project update error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete IDE project
router.delete('/projects/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const db = getDatabase();
    const result = await db.query(
      'DELETE FROM ide_projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('IDE project deletion error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;