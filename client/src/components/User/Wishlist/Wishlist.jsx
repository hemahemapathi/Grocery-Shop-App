import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useAuth } from '../../../context/AuthContext';
import CartContext from '../../../context/CartContext';
import ProductContext from '../../../context/ProductContext';
import api from '../../../services/api';
import './Wishlist.css';

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth(); // Use useAuth hook and correct variable name
  const { addToCart } = useContext(CartContext);
  const { calculateDiscountedPrice } = useContext(ProductContext);
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/wishlist' } });
      return;
    }
    
    // Only fetch favorites if user is authenticated and user object exists
    if (isAuthenticated && user) {
      fetchFavorites();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Use direct fetch with the correct endpoint based on your .env file
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load wishlist items');
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      // Use direct fetch with the correct endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }
      
      setFavorites(favorites.filter(item => item._id !== productId));
      toast.success('Product removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove product from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          <Alert.Heading>Please Log In</Alert.Heading>
          <p>You need to be logged in to view your wishlist.</p>
          <Button variant="primary" as={Link} to="/login">
            Log In
          </Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Loading your wishlist...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
        <Button variant="outline-primary" as={Link} to="/products">
          <FaArrowLeft className="me-2" />
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 wishlist-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="wishlist-title">
          <FaHeart color='#bb1212'/>
          My Wishlist
        </h1>
        <Button variant="outline-primary" as={Link} to="/products">
          <FaArrowLeft className="me-2" />
          Continue Shopping
        </Button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <div className="empty-wishlist-icon mb-3">
            <FaHeart size={50} />
          </div>
          <h3>Your wishlist is empty</h3>
          <p className="text-muted">Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
          <Button variant="success" as={Link} to="/products" className="mt-3">
            Discover Products
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">You have {favorites.length} item{favorites.length !== 1 ? 's' : ''} in your wishlist</p>
          
           
      <Row>
          {favorites.map(product => (
         <Col key={product._id} xs={12} sm={6} md={4} className="mb-4">
         <Card className="wishlist-item-card h-100">
         <div className="wishlist-item-img-container">
          <Link to={`/product/${product._id}`}>
            <Card.Img 
              variant="top" 
              src={product.imageUrl || product.image} 
              alt={product.name} 
              className="wishlist-item-img"
            />
          </Link>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="wishlist-item-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </Card.Title>
          
          <div className="mb-2 text-muted">
            {product.category && <span className="me-2">{product.category}</span>}
            {product.brand && <span>{product.brand}</span>}
          </div>
          
          <div className="mb-3">
            {product.discount > 0 ? (
              <div className="d-flex align-items-center">
                <span className="text-danger fw-bold me-2">
                  ${calculateDiscountedPrice(product.price, product.discount)}
                </span>
                <span className="text-muted text-decoration-line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ms-2 discount-badge">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="fw-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mt-auto d-flex">
            <Button 
              variant="success" 
              className="flex-grow-1 me-2"
              onClick={() => handleAddToCart(product)}
              disabled={product.countInStock === 0}
            >
              <FaShoppingCart className="me-2" />
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={() => removeFromFavorites(product._id)}
            >
              <FaTrash />
            </Button>
           </div>
          </Card.Body>
         </Card>
        </Col>
         ))}
    </Row>

        </>
      )}
    </Container>
  );
};

export default Wishlist;
