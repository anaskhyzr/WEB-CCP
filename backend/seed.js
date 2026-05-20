require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: 'Wireless Headphones Pro',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
    price: 299.99,
    category: 'Electronics',
    stock: 50,
    thumbnail: 'https://via.placeholder.com/300x300?text=Wireless+Headphones',
    rating: 4.5,
    reviews: 128,
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Advanced fitness tracking with heart rate monitor and water resistance',
    price: 349.99,
    category: 'Electronics',
    stock: 35,
    thumbnail: 'https://via.placeholder.com/300x300?text=Smart+Watch',
    rating: 4.3,
    reviews: 95,
  },
  {
    name: 'USB-C Charging Cable',
    description: 'Durable 2-meter USB-C cable with fast charging support',
    price: 19.99,
    category: 'Electronics',
    stock: 200,
    thumbnail: 'https://via.placeholder.com/300x300?text=USB+Cable',
    rating: 4.0,
    reviews: 234,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors',
    price: 29.99,
    category: 'Fashion',
    stock: 150,
    thumbnail: 'https://via.placeholder.com/300x300?text=Cotton+Tshirt',
    rating: 4.2,
    reviews: 167,
  },
  {
    name: 'Denim Jeans Classic',
    description: 'Classic blue denim jeans with perfect fit and durability',
    price: 59.99,
    category: 'Fashion',
    stock: 100,
    thumbnail: 'https://via.placeholder.com/300x300?text=Denim+Jeans',
    rating: 4.4,
    reviews: 213,
  },
  {
    name: 'Leather Wallet',
    description: 'Slim genuine leather wallet with multiple card slots',
    price: 49.99,
    category: 'Fashion',
    stock: 80,
    thumbnail: 'https://via.placeholder.com/300x300?text=Leather+Wallet',
    rating: 4.6,
    reviews: 156,
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe for 12 cups',
    price: 79.99,
    category: 'Home',
    stock: 45,
    thumbnail: 'https://via.placeholder.com/300x300?text=Coffee+Maker',
    rating: 4.3,
    reviews: 89,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable LED lamp with USB charging port and touch controls',
    price: 34.99,
    category: 'Home',
    stock: 120,
    thumbnail: 'https://via.placeholder.com/300x300?text=LED+Lamp',
    rating: 4.5,
    reviews: 142,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with carrying strap, 6mm thickness',
    price: 39.99,
    category: 'Sports',
    stock: 90,
    thumbnail: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
    rating: 4.7,
    reviews: 178,
  },
  {
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbells set ranging from 5kg to 25kg',
    price: 129.99,
    category: 'Sports',
    stock: 60,
    thumbnail: 'https://via.placeholder.com/300x300?text=Dumbbells',
    rating: 4.4,
    reviews: 134,
  },
  {
    name: 'The Web Developer Guide',
    description: 'Comprehensive guide to modern web development with JavaScript and React',
    price: 39.99,
    category: 'Books',
    stock: 200,
    thumbnail: 'https://via.placeholder.com/300x300?text=Web+Dev+Book',
    rating: 4.6,
    reviews: 267,
  },
  {
    name: 'Learn Node.js Mastery',
    description: 'In-depth tutorial on building scalable backend applications with Node.js',
    price: 44.99,
    category: 'Books',
    stock: 150,
    thumbnail: 'https://via.placeholder.com/300x300?text=Node+Book',
    rating: 4.5,
    reviews: 198,
  },
  {
    name: 'Building MERN Stack Apps',
    description: 'Complete course material for developing full-stack MERN applications',
    price: 49.99,
    category: 'Books',
    stock: 100,
    thumbnail: 'https://via.placeholder.com/300x300?text=MERN+Book',
    rating: 4.8,
    reviews: 312,
  },
  {
    name: 'Puzzle 3D Castle',
    description: '3D castle puzzle with 500 pieces for fun building experience',
    price: 24.99,
    category: 'Toys',
    stock: 75,
    thumbnail: 'https://via.placeholder.com/300x300?text=3D+Puzzle',
    rating: 4.3,
    reviews: 156,
  },
  {
    name: 'Robot Building Kit',
    description: 'Educational robot kit with programmable features for learning coding',
    price: 89.99,
    category: 'Toys',
    stock: 40,
    thumbnail: 'https://via.placeholder.com/300x300?text=Robot+Kit',
    rating: 4.6,
    reviews: 234,
  },
  {
    name: 'Board Game Strategy Pack',
    description: 'Collection of 3 strategy board games for family entertainment',
    price: 59.99,
    category: 'Toys',
    stock: 55,
    thumbnail: 'https://via.placeholder.com/300x300?text=Board+Games',
    rating: 4.4,
    reviews: 189,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✓ Inserted ${insertedProducts.length} sample products`);

    console.log('✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
