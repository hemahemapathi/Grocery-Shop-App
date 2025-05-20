import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';

import dotenv from 'dotenv';
dotenv.config();

// Configure email transporter with proper error handling
const createTransporter = () => {
  console.log('Email config:', {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER ? 'Set' : 'Not set',
    pass: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
  });
  
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    console.log('Forgot password request for email:', email);

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      // For security reasons, still return success even if email doesn't exist
      return res.status(200).json({ 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }
    
    // Generate random token
    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Generated token:', resetToken);
    
    // Set token and expiration on user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    console.log('Saving token to user:', user.email);
    console.log('Token expiration set to:', new Date(user.resetPasswordExpires));
    
    await user.save();
    console.log('User saved with token');

      // Verify the token was saved correctly
    const verifyUser = await User.findOne({ email });
    console.log('Verification - Token saved in DB:', verifyUser.resetPasswordToken);
    console.log('Verification - Token expiration in DB:', new Date(verifyUser.resetPasswordExpires));
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@groceryshop.com',
      to: user.email,
      subject: 'Password Reset - Grocery Shop',
      html: `
        <h1>You requested a password reset</h1>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `
    };
    
    // Create transporter
    const transporter = createTransporter();
    
    // For development/testing, log the reset URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Password reset URL (for testing):', resetUrl);
    }
    
    try {
      // Send email
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Still return success for security reasons, but log the error
    }
    
    res.status(200).json({ 
      message: 'If your email is registered, you will receive a password reset link' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// @desc    Verify reset token
// @route   GET /api/auth/reset-password/:token
// @access  Public
export const verifyResetToken = async (req, res) => {
  try {
    console.log('Token being verified:', req.params.token);
    
    // Find user with the given token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    console.log('User found with token:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Token expiration time:', new Date(user.resetPasswordExpires));
      console.log('Current time:', new Date());
    } else {
      // Try to find a user with just the token to see if it's expired
      const expiredUser = await User.findOne({
        resetPasswordToken: req.params.token
      });
      
      if (expiredUser) {
        console.log('Found user but token expired. Expiration:', 
          new Date(expiredUser.resetPasswordExpires));
      } else {
        console.log('No user found with this token at all');
      }
    }
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Reset token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
};



// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find user with the given token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    
    // Set new password (will be hashed by pre-save hook)
    user.password = req.body.password;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Save user with new password
    await user.save();
    
    // Create transporter
    const transporter = createTransporter();
    
    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@groceryshop.com',
      to: user.email,
      subject: 'Your password has been changed - Grocery Shop',
      html: `
        <h1>Password Change Confirmation</h1>
        <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log('Password change confirmation email sent successfully');
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with the response even if email fails
    }
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};
