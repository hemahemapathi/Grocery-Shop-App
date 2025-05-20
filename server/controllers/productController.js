import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary'; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    
    // Build filter object
    const filter = {};
    
    // Category filter
    if (req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }
    
    // Search by name
    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword, $options: 'i' };
    }
    
    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = { 
        $gte: Number(req.query.minPrice), 
        $lte: Number(req.query.maxPrice) 
      };
    } else if (req.query.minPrice) {
      filter.price = { $gte: Number(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      filter.price = { $lte: Number(req.query.maxPrice) };
    }
    
    // Organic filter
    if (req.query.organic === 'true') {
      filter.isOrganic = true;
    }
    
    // Count total documents with the filter
    const count = await Product.countDocuments(filter);
    
    // Get products with pagination
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(req.query.sort || '-createdAt');
    
    res.status(200).json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      brand, 
      category, 
      price, 
      countInStock, 
      discount, 
      unit, 
      isOrganic, 
      isFeatured,
      image  // This would be the image URL if provided
    } = req.body;
    
    // Determine the image path - either from uploaded file or provided URL
    let imagePath = '';
    
    if (req.files && req.files.image) {
      // Handle file upload
      const file = req.files.image;
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const uploadPath = path.join(__dirname, '..', 'uploads', fileName);
      
      // Move the file to uploads directory
      await file.mv(uploadPath);
      imagePath = `/uploads/${fileName}`;
    } else if (image) {
      // Use provided image URL
      imagePath = image;
    } else {
      return res.status(400).json({ message: 'Please provide an image URL or upload an image' });
    }
    
    const product = new Product({
      name,
      image: imagePath,
      description,
      brand,
      category,
      price,
      countInStock,
      discount: discount || 0,
      unit,
      isOrganic: isOrganic === 'true' || isOrganic === true,
      isFeatured: isFeatured === 'true' || isFeatured === true
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      brand, 
      category, 
      price, 
      countInStock, 
      discount, 
      unit, 
      isOrganic, 
      isFeatured 
    } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Handle image upload if a new image is provided
    if (req.files && req.files.image) {
      // Delete old image if it exists
      if (product.image && product.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const file = req.files.image;
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const uploadPath = path.join(__dirname, '..', 'uploads', fileName);
      
      // Move the file to uploads directory
      await file.mv(uploadPath);
      product.image = `/uploads/${fileName}`;
    }
    
    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.price = price !== undefined ? price : product.price;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.discount = discount !== undefined ? discount : product.discount;
    product.unit = unit || product.unit;
    product.isOrganic = isOrganic !== undefined ? isOrganic === 'true' : product.isOrganic;
    product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;
    
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Delete product image if it exists
      if (product.image && product.image.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Replace product.remove() with findByIdAndDelete or deleteOne
      await Product.deleteOne({ _id: product._id });
      
      res.status(200).json({ message: 'Product removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };
    
    product.reviews.push(review);
    
    // Calculate average rating
    product.calculateAverageRating();
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ rating: -1 })
      .limit(5);
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    
    const products = await Product.find({ isFeatured: true })
      .limit(limit);
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getProductCategories = async (req, res) => {
  try {
    // First, get all unique categories
    const categories = await Product.aggregate([
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    // Add default categories if they don't exist in the results
    const defaultCategories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages'];
    
    const existingCategoryIds = categories.map(cat => cat._id);
    
    defaultCategories.forEach(category => {
      if (!existingCategoryIds.includes(category)) {
        categories.push({
          _id: category,
          count: 0,
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0
        });
      }
    });
    
    // Sort again to ensure default categories with count 0 are at the end
    categories.sort((a, b) => b.count - a.count);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
};


// Add this function to your productController.js

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private/Admin
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const file = req.files.image;
    console.log('File to upload:', file.name, 'Size:', file.size, 'Temp path:', file.tempFilePath);
    
    // Use a simpler upload configuration
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'grocery-shop/products'
    });
    
    console.log('Cloudinary upload result:', result);
    
    // Return the image URL
    res.json(result.secure_url);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};


// @desc    Get top product reviews
// @route   GET /api/products/reviews/top
// @access  Public
export const getTopReviews = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 3;
    
    // Aggregate to get top reviews across all products
    const reviews = await Product.aggregate([
      // Unwind the reviews array to work with individual reviews
      { $unwind: '$reviews' },
      // Sort by rating (highest first) and then by date (newest first)
      { $sort: { 'reviews.rating': -1, 'reviews.createdAt': -1 } },
      // Limit to the requested number of reviews
      { $limit: limit },
      // Project only the needed fields
      { 
        $project: { 
          _id: 0,
          productId: '$_id',
          productName: '$name',
          reviewId: '$reviews._id',
          reviewer: '$reviews.name',
          rating: '$reviews.rating',
          comment: '$reviews.comment',
          createdAt: '$reviews.createdAt'
        } 
      }
    ]);
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching top reviews:', error);
    res.status(500).json({ message: error.message });
  }
};
