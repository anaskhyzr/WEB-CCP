import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
  DBHOST = '127.0.0.1',
  DBPORT = '3306',
  DBUSER = 'root',
  DBPASSWORD = '',
  DBDATABASE = 'ecommerce'
} = process.env;

export const pool = mysql.createPool({
  host: DBHOST,
  port: Number(DBPORT),
  user: DBUSER,
  password: DBPASSWORD,
  database: DBDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
