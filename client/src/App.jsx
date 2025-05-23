import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';

// Components
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Auth/Login/Login.jsx';
import Register from './components/Auth/Register/Register.jsx';
import CustomerProductList from './components/Products/ProductList/ProductList.jsx';
import ProductDetail from './components/Products/ProductDetail/ProductDetail.jsx';
import Cart from './components/Cart/Cart/Cart.jsx';
import Checkout from './components/Cart/Checkout/Checkout.jsx';
import OrderDetails from './components/Order/OrderDetails.jsx';
import Dashboard from './components/Admin/Dashboard/Dashboard.jsx';
import OrderDetail from './components/Admin/OrderDetails/OrderDetail.jsx';
import OrderList from './components/Admin/OrderList/OrderList.jsx';
import ProductForm from './components/Admin/ProductForm/ProductForm.jsx';
import UserList from './components/Admin/UserList/UserList.jsx';
import AdminProductList from './components/Admin/ProductList/ProductList.jsx';
import OrderForm from './components/Admin/OrderForm/OrderForm.jsx';
import Contact from './components/Contact/Contact.jsx';
import FAQ from './components/Info/FAQ/FAQ.jsx';
import ShippingDelivery from './components/Info/ShippingDelivery/ShippingDelivery.jsx';
import ReturnsRefunds from './components/Info/ReturnsRefunds/ReturnsRefunds.jsx';
import TermsConditions from './components/Info/TermsConditions/TermsConditions.jsx';
import PrivacyPolicy from './components/Info/PrivacyPolicy/PrivacyPolicy.jsx';
import CategoryProducts from './components/Products/Category/CategoryProducts.jsx';
import Wishlist from './components/User/Wishlist/Wishlist';
import Profile from './components/Auth/Profile/Profile.jsx';
import Revenue from './components/Admin/Revenue/Revenue';
import AdminProfile from './components/Admin/AdminProfile/AdminProfile';
import AdminNavbar from './components/Admin/AdminNavbar/AdminNavbar.jsx';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword.jsx';

// Context providers
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// CSS
import './App.css';
import AllOrders from './components/Admin/AllOrders/AllOrders.jsx';

// Protected route component for admin routes
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Protected route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Component to handle the root path redirection
const RootRedirect = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  return <Home />;
};

// Main application with routing
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div className="app-container">
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      <main className="main-content">
        <Routes>
          {/* Root path redirects based on user role */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />

          {/* Customer routes */}
          <Route path="/products" element={<CustomerProductList />} />
          <Route path="/products/category/:category" element={<CustomerProductList />} />
          <Route path="/products/:category" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* Protected customer routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order/:id" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/revenue" element={
            <AdminRoute>
              <Revenue />
            </AdminRoute>
          } />

           <Route path="/admin/all-orders" element={
            <AdminRoute>
              <AllOrders />
            </AdminRoute>
          } />

          <Route path="/admin/profile" element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <OrderList />
            </AdminRoute>
          } />
          <Route path="/admin/orders/:id" element={
            <AdminRoute>
              <OrderDetail />
            </AdminRoute>
          } />
          <Route path="/admin/orders/:id/edit" element={
            <AdminRoute>
              <OrderForm />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProductList />
            </AdminRoute>
          } />
          <Route path="/admin/products/:id/edit" element={
            <AdminRoute>
              <ProductForm />
            </AdminRoute>
          } />
          <Route path="/admin/products/create" element={
            <AdminRoute>
              <ProductForm />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          } />
          
          {/* Info Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/returns-refunds" element={<ReturnsRefunds />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <AppContent />
              <ToastContainer position="bottom-right" />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
