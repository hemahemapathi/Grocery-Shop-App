import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantityHandler = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      const { data } = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating quantity');
      console.error('Error updating quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItemHandler = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        setLoading(true);
        const { data } = await api.delete(`/cart/${itemId}`);
        setCart(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error removing item');
        console.error('Error removing item:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearCartHandler = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setLoading(true);
        await api.delete('/cart');
        setCart({ cartItems: [], totalPrice: 0 });
      } catch (err) {
        setError(err.response?.data?.message || 'Error clearing cart');
        console.error('Error clearing cart:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  if (loading && !cart) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!cart || cart.cartItems?.length === 0) {
    return (
      <div className="py-5">
        <Row>
          <Col md={12}>
            <Alert variant="info">
              Your cart is empty <Link to="/">Go Back</Link>
            </Alert>
          </Col>
        </Row>
      </div>
    );
  }

  return (
       <div className="py-5 cart-container">
  <h1 className="mb-4">Shopping Cart<img src="/assets/images/shopping-cart.png" alt="Shopping Cart" height="50" /></h1>
  <Row className="justify-content-center">
    {/* Reduce width by using col-md-10 instead of col-md-12 */}
    <Col md={10} className="mb-4">
      <ListGroup variant="flush" className="cart-items-container">
        {cart.cartItems.map((item) => (
          <ListGroup.Item key={item._id} className="cart-item">
            <Row className="align-items-center">
              <Col xs={3} sm={2}>
                <Image src={item.image} alt={item.name} fluid rounded className="cart-item-image" />
              </Col>
              <Col xs={9} sm={3}>
                <Link to={`/product/${item.product}`} className="cart-item-name">{item.name}</Link>
              </Col>
              <Col xs={6} sm={2} className="text-center">
                ${item.price.toFixed(2)}
              </Col>
              <Col xs={6} sm={3} className="d-flex align-items-center">
                <Button 
                  variant="light" 
                  onClick={() => updateQuantityHandler(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="btn-sm quantity-btn"
                >
                  <FaMinus />
                </Button>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantityHandler(item._id, Number(e.target.value))}
                  className="text-center mx-2 quantity-input"
                />
                <Button 
                  variant="light" 
                  onClick={() => updateQuantityHandler(item._id, item.quantity + 1)}
                  className="btn-sm quantity-btn"
                >
                  <FaPlus />
                </Button>
              </Col>
              <Col xs={12} sm={2} className="text-right">
                <Button
                  variant="danger"
                  className="btn-sm remove-btn"
                  onClick={() => removeItemHandler(item._id)}
                >
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
        <ListGroup.Item className="clear-cart-container">
          <Button
            variant="outline-danger"
            className="btn-block clear-cart-btn"
            onClick={clearCartHandler}
            disabled={cart.cartItems.length === 0}
          >
            Clear Cart
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Col>
    
    {/* Also reduce width of summary card */}
    <Col md={8}>
      <Card className="cart-summary-card">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>
              Subtotal ({cart.cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              items
            </h2>
            ${cart.totalPrice.toFixed(2)}
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              type="button"
              className="btn-block checkout-btn"
              disabled={cart.cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
  </Row>
</div>

  );
};

export default Cart;
