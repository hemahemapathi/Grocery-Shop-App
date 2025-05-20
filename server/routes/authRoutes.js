import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites
} from '../controllers/authController.js';
import {forgotPassword,verifyResetToken,resetPassword } from '../controllers/passwordController.js'
import { protect } from '../middleware/auth.js';
import { check } from 'express-validator';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authorized, no token
 */
router.get('/profile', protect, getUserProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized, no token
 */
router.put('/profile', protect, updateUserProfile);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/users', protect, isAdmin, getUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', protect, isAdmin, deleteUser);

/**
 * @swagger
 * /api/auth/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User favorites retrieved successfully
 *       401:
 *         description: Not authorized, no token
 */
router.get('/favorites', protect, getUserFavorites);

/**
 * @swagger
 * /api/auth/favorites/{id}:
 *   post:
 *     summary: Add product to favorites
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product added to favorites
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Product not found
 */
router.post('/favorites/:id', protect, addToFavorites);

/**
 * @swagger
 * /api/auth/favorites/{id}:
 *   delete:
 *     summary: Remove product from favorites
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from favorites
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Product not found in favorites
 */
router.delete('/favorites/:id', protect, removeFromFavorites);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent if email exists
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   get:
 *     summary: Verify password reset token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Token is invalid or expired
 *       500:
 *         description: Server error
 */
router.get('/reset-password/:token', verifyResetToken);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or password requirements not met
 *       500:
 *         description: Server error
 */
router.post('/reset-password/:token', [
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], resetPassword);


export default router;
