# 🛒 Grocery Shop App

Grocery Shop App is a full-stack e-commerce platform built with React, Node.js, and MongoDB. This comprehensive solution features user authentication, product browsing with advanced filtering, shopping cart functionality, secure checkout with Stripe integration, and order tracking. The admin dashboard provides complete control over products, orders, and user management with real-time analytics. Responsive design ensures seamless shopping across all devices, while secure payment processing and JWT authentication maintain data integrity.


![Grocery Shop Banner](https://via.placeholder.com/800x200?text=Grocery+Shop+App)

## ✨ Features

### 👤 User Features
- **Authentication** - Register, login, and password reset functionality
- **Product Browsing** - Browse products with filtering, sorting, and search
- **Shopping Cart** - Add, update, and remove items from cart
- **Checkout Process** - Complete order with shipping details
- **Payment Integration** - Secure payments with Stripe and Cash on Delivery options
- **Order Tracking** - View order history and track order status
- **User Profile** - Update personal information and view order history

### 👨‍💼 Admin Features
- **Dashboard** - Overview of orders, products, users, and revenue
- **Product Management** - Add, edit, and delete products
- **Order Management** - Process orders and update order status
- **User Management** - View and manage user accounts
- **Revenue Tracking** - Monitor sales and revenue

## 🛠️ Technologies Used

### Frontend
- **React.js** - UI component library
- **React Router** - Navigation and routing
- **React Bootstrap** - Responsive UI components
- **Stripe.js** - Payment processing
- **Axios** - API requests
- **React Toastify** - Toast notifications
- **CSS3** - Custom styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **SendGrid** - Email notifications
- **Stripe API** - Payment processing

## 📱 Responsive Design
- Fully responsive on all devices (mobile, tablet, desktop)
- Optimized user experience across different screen sizes

## 🔒 Security Features
- JWT authentication
- Password hashing
- Protected routes
- Secure payment processing
- Input validation

## 🖼️ Screenshots

### User Interface
![Product Listing](https://via.placeholder.com/400x200?text=Product+Listing)
![Shopping Cart](https://via.placeholder.com/400x200?text=Shopping+Cart)
![Checkout](https://via.placeholder.com/400x200?text=Checkout)

### Admin Interface
![Admin Dashboard](https://via.placeholder.com/400x200?text=Admin+Dashboard)
![Order Management](https://via.placeholder.com/400x200?text=Order+Management)
![Product Management](https://via.placeholder.com/400x200?text=Product+Management)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Stripe account for payments
- SendGrid account for emails

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/grocery-shop-app.git
cd grocery-shop-app
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```
# Server .env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_verified_sender_email
FRONTEND_URL=http://localhost:5173

# Client .env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Run the application
```bash
# Run server
cd server
npm run dev

# Run client
cd ../client
npm run dev
```

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- React.js team for the amazing library
- MongoDB for the flexible database
- Stripe for secure payment processing
- Bootstrap team for responsive UI components

---

© 2025 Grocery Shop App. All Rights Reserved.
