import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  brand: {
    type: String,
    default: 'Generic'
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Snacks', 'Organic', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: 0
  },
  countInStock: {
    type: Number,
    required: [true, 'Please provide count in stock'],
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Please provide a unit'],
    enum: ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'piece', 'pack', 'dozen', 'bunch','box'],
    default: 'piece'
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (!this.discount) return this.price;
  return this.price - (this.price * this.discount / 100);
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.numReviews;
  }
};

const Product = mongoose.model('Product', productSchema);

export default Product;
