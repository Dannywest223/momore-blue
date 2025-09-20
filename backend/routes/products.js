const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/products';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get featured products - MOVED BEFORE the /:id route to avoid conflicts
router.get('/featured/list', async (req, res) => {
  try {
    console.log('Fetching featured products...');
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(12); // Increased limit to show more products
    
    console.log(`Found ${products.length} featured products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    const query = {};

    // Apply filters
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Product query:', query);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    console.log(`Found ${products.length} products out of ${total} total`);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, featured, stockQuantity } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const images = req.files.map(file => `/uploads/products/${file.filename}`);

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      featured: featured === 'true' || featured === true,
      stockQuantity: parseInt(stockQuantity) || 0,
      inStock: parseInt(stockQuantity) > 0
    });

    await product.save();

    console.log('New product created:', product);

    // Emit real-time update
    if (req.io) {
      req.io.emit('productAdded', product);
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, featured, stockQuantity } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (stockQuantity !== undefined) {
      product.stockQuantity = parseInt(stockQuantity);
      product.inStock = product.stockQuantity > 0;
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    console.log('Product updated:', product);

    // Emit real-time update
    if (req.io) {
      req.io.emit('productUpdated', product);
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images
    product.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);

    console.log('Product deleted:', req.params.id);

    // Emit real-time update
    if (req.io) {
      req.io.emit('productDeleted', req.params.id);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update featured status (Admin only)
router.patch('/bulk/featured', adminAuth, async (req, res) => {
  try {
    const { productIds, featured } = req.body;

    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: 'productIds must be an array' });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { featured: featured === true }
    );

    console.log(`Updated featured status for ${result.modifiedCount} products`);

    // Emit real-time update for bulk changes
    if (req.io) {
      req.io.emit('productsBulkUpdated', { productIds, featured });
    }

    res.json({ 
      message: `Updated featured status for ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.filter(cat => cat)); // Filter out empty categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product statistics (Admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: { $sum: '$stockQuantity' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalProducts,
      featuredProducts,
      inStockProducts,
      outOfStockProducts,
      categoryStats
    });
  } catch (error) {
    console.error('Error fetching product statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;