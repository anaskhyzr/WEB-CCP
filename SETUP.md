# E-Commerce Project Setup

**Full MongoDB backend with Express API + React frontend**

## Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (running locally or provide MongoDB URI in `.env`)

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Seed the Database

```bash
cd backend
npm run seed
```

This will populate MongoDB with sample products.

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The API will be available at `http://localhost:5000/api`

Check health: `http://localhost:5000/api/health`

### 4. Start the Frontend Application

**In a new terminal:**

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## Development Mode

For auto-reload during development:

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
npm run dev
```

## Project Structure

```
├── backend/           # Express.js API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Business logic
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── server.js      # Entry point
│   └── seed.js        # Database seeding
│
└── frontend/          # React + Vite app
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API calls (calls real backend)
    │   ├── store/       # Redux state management
    │   └── hooks/       # Custom hooks
    ├── vite.config.js
    └── package.json
```

## Environment Variables

**Backend** (`.env`):
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get product categories
- `GET /api/products/price-range` - Get price range

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:orderNumber` - Get order details
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:orderNumber` - Update order status

## Database

The backend connects to MongoDB and stores:
- **Products** - with filtering by category, price range, search
- **Orders** - with customer info, items, and status tracking

All data persists in MongoDB. Seed the database once with `npm run seed` in the backend folder.

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod` (Windows: `mongod.exe`)
- For MongoDB Atlas, update `MONGODB_URI` in backend `.env` to your connection string
- Check MONGODB_URI in `.env`

**Port already in use:**
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

**API not connecting:**
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Check browser console for CORS errors

## Files for Git

When pushing to GitHub, these files are important:
```
.gitignore           # (created) - Excludes node_modules, .env files
backend/.env.example # (created) - Example environment variables
frontend/.env.example # (created) - Example environment variables
backend/package.json
frontend/package.json
backend/server.js
frontend/vite.config.js
# All source files in src/ and models/routes/controllers
```

**DO NOT commit:**
- `node_modules/`
- `.env` (only commit `.env.example`)
- `dist/` (build output)
- `.DS_Store` / `Thumbs.db`
