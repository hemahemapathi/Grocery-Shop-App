import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../UI/Loader';
import Message from '../UI/Message';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        console.log('Order data received:', data); 
        if (!data.itemsPrice) {
          data.itemsPrice = data.totalPrice - data.shippingPrice - data.taxPrice;
        }
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getDeliveryDate = () => {
    if (!order) return '';
    
    const createdDate = new Date(order.createdAt);
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!order) {
    return <Message variant="info">Order not found</Message>;
  }

return (
  <div className="py-3">
    <h1 className="mb-3">Order #{order._id.substring(order._id.length - 8)}<img src="/assets/images/order.png" alt="" height="50" /></h1>
    
    <Row>
      <Col md={10} lg={8} className="mx-auto">
        <Row>
          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h2 className="h5 mb-3">Shipping</h2>
                <p className="mb-1">
                  <strong>Name: </strong> {order.user?.name || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Email: </strong> {order.user?.email || 'N/A'}
                </p>
                <p className="mb-2">
                  <strong>Address: </strong>
                  {order.shippingAddress?.address || 'N/A'}, 
                  {order.shippingAddress?.city || 'N/A'}{' '}
                  {order.shippingAddress?.postalCode || 'N/A'}, 
                  {order.shippingAddress?.country || 'N/A'}
                </p>
                
                <div>
                  <h5 className="h6">Delivery Status:</h5>
                  <div className="delivery-status">
                    {order.isDelivered ? (
                      <Alert variant="success" className="py-2">
                        Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                      </Alert>
                    ) : (
                      <Alert variant="info" className="py-2">
                        {order.status === 'Cancelled' ? (
                          'Order Cancelled'
                        ) : (
                          <>
                            <div>Expected delivery: {getDeliveryDate()}</div>
                            <div>Status: {order.status || 'Processing'}</div>
                          </>
                        )}
                      </Alert>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h2 className="h5 mb-3">Payment</h2>
                <p className="mb-2">
                  <strong>Method: </strong> {order.paymentMethod || 'N/A'}
                </p>
                <div>
                  {order.isPaid ? (
                    <Alert variant="success" className="py-2">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </Alert>
                  ) : (
                    <Alert variant="warning" className="py-2">Not Paid</Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <h2 className="h5 mb-3">Order Items</h2>
            {!order.orderItems || order.orderItems.length === 0 ? (
              <Message>Your order is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id} className="py-2">
                    <Row className="align-items-center">
                      <Col md={2} xs={3}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={6} xs={9}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4} xs={12} className="text-end">
                        {item.quantity || 0} x ${(item.price || 0).toFixed(2)} = ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    
    <Row>
      <Col md={8} lg={6} className="mx-auto">
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="h5 mb-0">Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col className="text-end">
                ${(order.itemsPrice || order.totalPrice - order.shippingPrice - order.taxPrice || 0).toFixed(2)}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col className="text-end">${(order.shippingPrice || 0).toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col className="text-end">${(order.taxPrice || 0).toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col className="text-end">${(order.totalPrice || 0).toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            
            {order.status === 'Pending' && !order.isPaid && (
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block w-100"
                  onClick={() => {
                    toast.info('Payment functionality would be implemented here');
                  }}
                >
                  Pay Now
                </Button>
              </ListGroup.Item>
            )}
            
            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
              <ListGroup.Item>
                <Button
                  type="button"
                  variant="danger"
                  className="btn-block w-100"
                  onClick={async () => {
                    try {
                      await api.put(`/orders/${order._id}/cancel`);
                      toast.success('Order cancelled successfully');
                      const { data } = await api.get(`/orders/${id}`);
                      setOrder(data);
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Error cancelling order');
                    }
                  }}
                >
                  Cancel Order
                </Button>
              </ListGroup.Item>
            )}
            
            <ListGroup.Item>
              <Link to="/products" className="btn btn-primary w-100">
                Continue Shopping
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </div>
 );
};

export default OrderDetails;