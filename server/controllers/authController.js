import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js'; 

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine role based on email
    const role = email.endsWith('@admins.com') ? 'admin' : 'user';

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      
      // Don't allow changing email if it would change role status
      if (req.body.email) {
        const currentIsAdmin = user.email.endsWith('@admins.com');
        const newIsAdmin = req.body.email.endsWith('@admins.com');
        
        if (currentIsAdmin !== newIsAdmin) {
          return res.status(400).json({ 
            message: 'Cannot change email in a way that would change admin status' 
          });
        }
        
        user.email = req.body.email;
      }
      
      // Handle address as a nested object
      if (req.body.address) {
        user.address = {
          street: req.body.address.street || user.address?.street || '',
          city: req.body.address.city || user.address?.city || '',
          state: req.body.address.state || user.address?.state || '',
          zipCode: req.body.address.zipCode || user.address?.zipCode || '',
          country: req.body.address.country || user.address?.country || ''
        };
      }
      
      user.phone = req.body.phone || user.phone;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
};


// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (user) {
      res.status(200).json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In favourites
export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // If you store favorite IDs in the user model
    const favorites = await Product.find({ _id: { $in: user.favorites } });
    
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;
    
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    
    res.status(200).json({ message: 'Product added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;
    
    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();
    
    res.status(200).json({ message: 'Product removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




