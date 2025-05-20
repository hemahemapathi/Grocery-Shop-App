import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, ListGroup, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './Checkout.css';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_51QrJeyHC7M2dVX5yjMpw3mcUmKUnAc0EP6LgQPvrp1SgfXxkpjKDmHBTUteBjdORjqQO3kDzN08wyPrgPig5vKZK001KQxaTji');

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(false);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  
  // Calculated values
  const [itemsPrice, setItemsPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Order state
  const [orderId, setOrderId] = useState(null); // Add this state variable
  
  // Payment state
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart) {
      // Calculate prices
      const itemsTotal = cart.totalPrice || 0;
      const shipping = itemsTotal > 100 ? 0 : 10;
      const tax = Number((0.15 * itemsTotal).toFixed(2));
      const total = (itemsTotal + shipping + tax);
      
      setItemsPrice(itemsTotal);
      setShippingPrice(shipping);
      setTaxPrice(tax);
      setTotalPrice(total);
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      
      if (!data || !data.cartItems || data.cartItems.length === 0) {
        navigate('/cart');
        toast.error('Your cart is empty');
        return;
      }
      
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create order first, then handle payment
  const placeOrderHandler = async (e) => {
    e.preventDefault();
    
    // Validate form
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping details');
      return;
    }

    try {
      setProcessingOrder(true);
      
      // Create order
      const orderData = {
        orderItems: cart.cartItems.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };
      
      const { data } = await api.post('/orders', orderData);
      setOrderId(data._id); // Save the order ID
      
      // For cash on delivery, navigate to order details
      if (paymentMethod === 'CashOnDelivery') {
        navigate(`/order/${data._id}`);
        toast.success('Order placed successfully!');
      }
      // For Stripe, the payment will be handled by the Stripe form
      // The order will be processed after payment success
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
      console.error('Error placing order:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  // Stripe Payment Form Component
  const StripeCheckoutForm = ({ totalPrice, orderId, onPaymentSuccess, onPaymentError, disabled }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState('');

    const handleSubmit = async (event) => {
      event.preventDefault();
      
      if (!stripe || !elements || !orderId) {
        return;
      }

      setProcessing(true);
      
      try {
        // Create payment intent on your server
        const { data } = await api.post('/orders/create-payment-intent', {
          amount: Math.round(totalPrice * 100), // Convert to cents
          orderId // Pass the order ID
        });

        const clientSecret = data.clientSecret;
        
        // Confirm card payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        });

        if (error) {
          setCardError(error.message);
          onPaymentError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          const result = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            payer: { email_address: 'customer@example.com' } // You'd get this from your form
          };
          
          onPaymentSuccess(result, orderId);
        }
      } catch (err) {
        console.error(err);
        onPaymentError('Payment processing failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    };

    return (
      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className="stripe-card-element">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {cardError && <div className="text-danger mt-2">{cardError}</div>}
        </div>
        <Button 
          type="submit" 
          className="btn-block w-100" 
          disabled={!stripe || processing || disabled || !orderId}
        >
          {processing ? 'Processing...' : `Pay ${totalPrice.toFixed(2)}`}
        </Button>
      </Form>
    );
  };

  // Handle payment success
  const handlePaymentSuccess = async (result, orderId) => {
    try {
      // Update the payment result state
      setPaymentSuccess(true);
      setPaymentResult(result);
      
      // Update the order payment status
      await api.put(`/orders/${orderId}/pay`, result);
      
      // Show success message
      toast.success('Payment successful!');
      
      // Navigate to order details
      navigate(`/order/${orderId}`);
    } catch (error) {
      toast.error('Error updating payment status');
      console.error(error);
    }
  };

  const handlePaymentError = (errorMessage) => {
    toast.error(errorMessage);
  };

  // Separate component for Stripe Elements
  const StripePaymentSection = ({ totalPrice, orderId, onPaymentSuccess, onPaymentError, disabled }) => {
    return (
      <Elements stripe={stripePromise}>
        <StripeCheckoutForm 
          totalPrice={totalPrice} 
          orderId={orderId}
          onPaymentSuccess={onPaymentSuccess} 
          onPaymentError={onPaymentError}
          disabled={disabled}
        />
      </Elements>
    );
  };

  if (loading && !cart) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  // Replace the existing return statement with this updated version
return (
  <div className="py-5">
    <h1 className="mb-4">Checkout<img src="/assets/images/checkout.png" alt="" height="50" /></h1>
    <Row>
      <Col md={10} lg={8} className="mx-auto mb-4">
        <Card className="mb-4">
          <Card.Body>
            <h2 className="mb-3">Shipping</h2>
            <Form>
              <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="city" className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="postalCode" className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="postalCode"
                      placeholder="Enter postal code"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="country" className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  placeholder="Enter country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h2 className="mb-3">Payment Method</h2>
            <Form>
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="Credit/Debit Card (Stripe)"
                  id="Stripe"
                  name="paymentMethod"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Cash on Delivery"
                  id="CashOnDelivery"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  checked={paymentMethod === 'CashOnDelivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h2 className="mb-3">Order Items</h2>
            {cart && cart.cartItems && cart.cartItems.length > 0 ? (
              <ListGroup variant="flush" className="compact-item-list">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id} className="checkout-item">
                    <Row className="align-items-center">
                      <Col md={1} xs={3}>
                        <Image src={item.image} alt={item.name} fluid rounded className="checkout-item-image" />
                      </Col>
                      <Col md={7} xs={9}>
                        <div className="checkout-item-name">{item.name}</div>
                      </Col>
                      <Col md={4} xs={12} className="text-right checkout-item-price">
                        {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Message>Your cart is empty</Message>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Order Summary - Now smaller width */}
      <Col md={8} lg={6} className="mx-auto">
        <Card className="order-summary-card">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col className="text-right">${itemsPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col className="text-right">${shippingPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col className="text-right">${taxPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col className="text-right">${totalPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              {error && <Message variant="danger">{error}</Message>}
            </ListGroup.Item>
            {/* Place Order Button */}
            <ListGroup.Item>
              {!orderId ? (
                <Button
                  type="button"
                  className="btn-block w-100"
                  disabled={cart?.cartItems?.length === 0 || processingOrder}
                  onClick={placeOrderHandler}
                >
                  {processingOrder ? 'Processing...' : 'Place Order'}
                </Button>
              ) : paymentMethod === 'Stripe' ? (
                <StripePaymentSection 
                  totalPrice={totalPrice} 
                  orderId={orderId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  disabled={processingOrder}
                />
              ) : null}
             </ListGroup.Item>
          </ListGroup>
         </Card>
       </Col>
     </Row>
   </div>
   );          
 };
            
export default Checkout;
            
