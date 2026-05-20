const Product = require('../models/Product');
const Joi = require('joi');

// Validation schema
const productQuerySchema = Joi.object({
  search: Joi.string().optional(),
  category: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sort: Joi.string().valid('price-asc', 'price-desc', 'newest', 'rating').optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(12).optional(),
});

// Get all products with filtering and search
exports.getProducts = async (req, res) => {
  try {
    const { error, value } = productQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: 'Invalid query parameters', details: error.details });
    }

    const { search, category, minPrice, maxPrice, sort, page, limit } = value;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Determine sort order
    let sortObj = {};
    switch (sort) {
      case 'price-asc':
        sortObj = { price: 1 };
        break;
      case 'price-desc':
        sortObj = { price: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Get available categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories: categories.sort() });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get price range
exports.getPriceRange = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    const { minPrice = 0, maxPrice = 1000 } = result[0] || {};
    res.json({ minPrice, maxPrice });
  } catch (error) {
    console.error('Error fetching price range:', error);
    res.status(500).json({ message: 'Error fetching price range', error: error.message });
  }
};

// Create product (for seeding)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, thumbnail, rating, reviews } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      thumbnail,
      rating,
      reviews,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};
