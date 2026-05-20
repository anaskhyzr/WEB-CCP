import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !customer.name || !customer.email) {
    return res.status(400).json({ error: 'Customer name and email are required.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required.' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const [orderRes] = await conn.execute(
      'INSERT INTO orders(customer_name, customer_email, total_amount) VALUES(?, ?, ?)',
      [customer.name, customer.email, total]
    );
    const orderId = orderRes.insertId;

    const insertItemText = 'INSERT INTO order_items(order_id, product_id, quantity, unit_price) VALUES(?, ?, ?, ?)';
    for (const item of items) {
      await conn.execute(insertItemText, [orderId, item.id, item.quantity, item.price]);
    }

    await conn.commit();
    res.json({ message: 'Checkout completed', orderId, total });
  } catch (error) {
    await conn.rollback();
    console.error('Checkout error', error);
    res.status(500).json({ error: 'Unable to complete checkout' });
  } finally {
    conn.release();
  }
});

export default router;
