import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  cancelOrder,
  createPaymentIntent
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         qty:
 *           type: integer
 *         image:
 *           type: string
 *         price:
 *           type: number
 *         product:
 *           type: string
 *           description: Product ID
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: User ID
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           type: string
 *         paymentResult:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             status:
 *               type: string
 *             update_time:
 *               type: string
 *             email_address:
 *               type: string
 *         taxPrice:
 *           type: number
 *         shippingPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *         isPaid:
 *           type: boolean
 *         paidAt:
 *           type: string
 *           format: date-time
 *         isDelivered:
 *           type: boolean
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               shippingAddress:
 *                 $ref: '#/components/schemas/ShippingAddress'
 *               paymentMethod:
 *                 type: string
 *               taxPrice:
 *                 type: number
 *               shippingPrice:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: No order items
 *       401:
 *         description: Not authorized, no token
 */
router.route('/').post(protect, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.route('/').get(protect, isAdmin, getOrders);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized, no token
 */
router.route('/myorders').get(protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Order not found
 */
router.route('/:id').get(protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Update order to paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *               update_time:
 *                 type: string
 *               email_address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated to paid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Order not found
 */
router.route('/:id/pay').put(protect, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Update order to delivered (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order updated to delivered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Order not found
 */
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Order not found
 */
router.route('/:id/status').put(protect, isAdmin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Order not found
 *       400:
 *         description: Order cannot be cancelled (already delivered or paid)
 */
router.route('/:id/cancel').put(protect, cancelOrder);

/**
 * @swagger
 * /api/orders/create-payment-intent:
 *   post:
 *     summary: Create a payment intent for Stripe
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in dollars
 *     responses:
 *       200:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Error creating payment intent
 */
router.route('/create-payment-intent').post(protect, createPaymentIntent);

export default router;
