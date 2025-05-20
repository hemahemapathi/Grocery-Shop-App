import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { isAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image (admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Image URL
 *       400:
 *         description: No image file uploaded
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Error uploading image
 */
router.post('/', isAuth, isAdmin, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const file = req.files.image;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'grocery-shop',
      use_filename: true,
    });

    // Return the image URL
    res.json(result.secure_url);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

export default router;
