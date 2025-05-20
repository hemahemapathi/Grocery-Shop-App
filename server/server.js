import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './docs/swagger.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import contactRoutes from './routes/contactRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});

// Make cloudinary available globally
app.locals.cloudinary = cloudinary;

// Set up Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods : ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/contact', contactRoutes);

// Stripe payment endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Something went wrong with payment processing' });
  }
});

// Test Cloudinary endpoint
app.get('/api/test-cloudinary', (req, res) => {
  res.json({
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME,
    message: 'Cloudinary is configured and ready to use'
  });
});

// API endpoints list
app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/templates/api-endpoints.html'));
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grocery Shop API</title>
        <link rel="stylesheet" href="/css/api-docs.css">
    </head>
    <body>
        <div class="container">
            <h1>Grocery Shop API</h1>
            <p>Welcome to the Grocery Shop API server. Use the links below to explore the API.</p>
            
            <div class="buttons">
                <a href="/api" class="btn">View API Endpoints</a>
                <a href="/api-docs" class="btn">Interactive API Documentation</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`API Endpoints list available at http://localhost:${PORT}/api`);
});