import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DBHOST = process.env.DBHOST || '127.0.0.1';
const DBPORT = Number(process.env.DBPORT || 3306);
const DBUSER = process.env.DBUSER || 'root';
const DBPASSWORD = process.env.DBPASSWORD || '';
const DBDATABASE = process.env.DBDATABASE || 'ecommerce';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: DBHOST,
    port: DBPORT,
    user: DBUSER,
    password: DBPASSWORD
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DBDATABASE}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`Database ${DBDATABASE} ready`);
  await connection.end();
}

async function createSchemaAndData() {
  const connection = await mysql.createConnection({
    host: DBHOST,
    port: DBPORT,
    user: DBUSER,
    password: DBPASSWORD,
    database: DBDATABASE
  });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(128) NOT NULL,
      inventory INT NOT NULL,
      image_url TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [productCountRows] = await connection.query('SELECT COUNT(*) AS count FROM products');
  if (Number(productCountRows[0].count) === 0) {
    const products = [
      ['Classic Tee', 'Everyday cotton t-shirt with soft fit.', 19.99, 'Apparel', 32, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'],
      ['Running Sneakers', 'Lightweight sneakers built for comfort.', 89.95, 'Footwear', 18, 'https://images.unsplash.com/photo-1528701800489-20b86b75ee5c?auto=format&fit=crop&w=400&q=80'],
      ['Wireless Headphones', 'Noise-isolating headphones with long battery life.', 129.00, 'Electronics', 15, 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80'],
      ['Travel Backpack', 'Durable backpack with laptop compartment.', 59.50, 'Accessories', 22, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'],
      ['Ceramic Coffee Mug', 'Bold ceramic mug with matte finish.', 14.99, 'Home', 46, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=400&q=80'],
      ['Desk Lamp', 'Warm LED desk lamp with adjustable arm.', 34.99, 'Home', 27, 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=400&q=80'],
      ['Yoga Mat', 'Non-slip yoga mat with cushioned support.', 29.95, 'Fitness', 40, 'https://images.unsplash.com/photo-1594737625785-d7d1885d0eb1?auto=format&fit=crop&w=400&q=80'],
      ['Bluetooth Speaker', 'Portable speaker with crisp sound and bass.', 55.00, 'Electronics', 21, 'https://images.unsplash.com/photo-1512446812894-2e1cc5b3c133?auto=format&fit=crop&w=400&q=80']
    ];

    for (const [name, description, price, category, inventory, image_url] of products) {
      await connection.query(
        'INSERT INTO products(name, description, price, category, inventory, image_url) VALUES(?, ?, ?, ?, ?, ?)',
        [name, description, price, category, inventory, image_url]
      );
    }
    console.log('Seeded product data');
  } else {
    console.log('Products already seeded');
  }

  const [orderCountRows] = await connection.query('SELECT COUNT(*) AS count FROM orders');
  if (Number(orderCountRows[0].count) === 0) {
    const [orderResult] = await connection.query(
      'INSERT INTO orders(customer_name, customer_email, total_amount) VALUES(?, ?, ?)',
      ['Alex Taylor', 'alex@example.com', 149.94]
    );
    const orderId = orderResult.insertId;

    const [productsRows] = await connection.query('SELECT id, price FROM products ORDER BY id LIMIT 2');
    for (const product of productsRows) {
      await connection.query(
        'INSERT INTO order_items(order_id, product_id, quantity, unit_price) VALUES(?, ?, ?, ?)',
        [orderId, product.id, 1, product.price]
      );
    }
    console.log('Seeded a sample order');
  } else {
    console.log('Orders already seeded');
  }

  await connection.end();
}

(async () => {
  try {
    await createDatabase();
    await createSchemaAndData();
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
})();
