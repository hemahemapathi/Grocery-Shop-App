import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      res.json(cart);
    } else {
      // If no cart exists yet, return an empty cart
      res.json({ cartItems: [], totalPrice: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        user: req.user._id,
        cartItems: [{
          product: productId,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity
        }],
        totalPrice: product.price * quantity
      });
    } else {
      // Check if item exists in cart
      const existingItemIndex = cart.cartItems.findIndex(
        item => item.product.toString() === productId
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.cartItems.push({
          product: productId,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity
        });
      }
      
      // Recalculate total price
      cart.totalPrice = cart.cartItems.reduce(
        (total, item) => total + item.price * item.quantity, 0
      );
    }
    
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.cartItems.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    cart.cartItems[itemIndex].quantity = quantity;
    
    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Filter out the item to remove
    cart.cartItems = cart.cartItems.filter(
      item => item._id.toString() !== itemId
    );
    
    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.cartItems = [];
    cart.totalPrice = 0;
    
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all carts (admin only)
// @route   GET /api/cart/all
// @access  Admin
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({}).populate('user', 'id name email');
    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
