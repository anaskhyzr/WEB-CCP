import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const whereClauses = [];
    const values = [];

    if (search) {
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern);
      whereClauses.push('(LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))');
    }

    if (category) {
      values.push(category);
      whereClauses.push('category = ?');
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `SELECT id, name, description, price, category, image_url, inventory FROM products ${where} ORDER BY id`;
    const rows = await query(sql, values);

    res.json(rows);
  } catch (error) {
    console.error('Products fetch error', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const rows = await query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(rows.map((row) => row.category));
  } catch (error) {
    console.error('Category fetch error', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
