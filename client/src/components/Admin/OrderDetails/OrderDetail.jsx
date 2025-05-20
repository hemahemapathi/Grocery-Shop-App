import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, ListGroup, Image, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  // In OrderDetail.jsx
const fetchOrderDetails = async () => {
  try {
    setLoading(true);
    // Check if id is 'create' and handle appropriately
    if (id === 'create'|| id === 'edit') {
      // Either redirect to a proper page or show a message
      setError('Invalid order ID');
      setLoading(false);
      return;
    }
    
    const { data } = await api.get(`/orders/${id}`);
    setOrder(data);
    setError(null);
  } catch (err) {
    setError(err.response?.data?.message || 'Error fetching order details');
    console.error('Error fetching order details:', err);
  } finally {
    setLoading(false);
  }
};


  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      
      // Update the order in the local state
      setOrder(prev => ({ ...prev, status: newStatus }));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating order status');
      console.error('Error updating order status:', err);
    }
  };

  const handleDeliverOrder = async () => {
    try {
      await api.put(`/orders/${id}/deliver`);
      
      // Update the order in the local state
      setOrder(prev => ({ 
        ...prev, 
        isDelivered: true, 
        deliveredAt: new Date(), 
        status: 'Delivered' 
      }));
      
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating delivery status');
      console.error('Error updating delivery status:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'Processing':
        return <Badge bg="info">Processing</Badge>;
      case 'Shipped':
        return <Badge bg="primary">Shipped</Badge>;
      case 'Delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'Cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!order) {
    return <Message>Order not found</Message>;
  }

return (
  <div className="py-3">
    <div className="order-header mb-4">
      <h2 className="order-title">Order Details</h2>
    
    </div>
    {/* First row - Order information card */}
    <Row className="mb-4">
      <Col md={10} lg={8} className="mx-auto">
        <Card>
          <Card.Header>
            <h3>Order #{order._id.substring(order._id.length - 6)}</h3>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {order.user?.name}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
              </Col>
              <Col md={6}>
                <h4>Order Information</h4>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p>
                  <strong>Status:</strong> {getStatusBadge(order.status)}
                </p>
              </Col>
            </Row>
            
            <Row className="mt-4">
              <Col md={6}>
                <h4>Shipping Address</h4>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>
                  <strong>Delivery Status:</strong>{' '}
                  {order.isDelivered ? (
                    <Badge bg="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Badge>
                  ) : (
                    <Badge bg="danger">Not Delivered</Badge>
                  )}
                </p>
              </Col>
              <Col md={6}>
                <h4>Payment Status</h4>
                <p>
                  {order.isPaid ? (
                    <Badge bg="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Badge>
                  ) : (
                    <Badge bg="danger">Not Paid</Badge>
                  )}
                </p>
                {order.paymentResult && (
                  <>
                    <p><strong>Transaction ID:</strong> {order.paymentResult.id}</p>
                    <p><strong>Status:</strong> {order.paymentResult.status}</p>
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    
    {/* Second row - Order items card */}
    <Row className="mb-4">
      <Col md={10} lg={8} className="mx-auto">
        <Card>
          <Card.Header>
            <h3>Order Items</h3>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {order.orderItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={2} xs={3}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={6} xs={9}>
                      <Link to={`/admin/products/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4} xs={12} className="text-right">
                      {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    
    {/* Third row - Order summary card */}
    <Row className="mb-4">
      <Col md={8} lg={6} className="mx-auto">
        <Card>
          <Card.Header>
            <h3>Order Summary</h3>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col className="text-right">${order.itemsPrice?.toFixed(2) || '0.00'}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col className="text-right">${order.shippingPrice?.toFixed(2) || '0.00'}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col className="text-right">${order.taxPrice?.toFixed(2) || '0.00'}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col className="text-right">${order.totalPrice?.toFixed(2) || '0.00'}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    
    {/* Fourth row - Actions card */}
    <Row>
      <Col md={8} lg={6} className="mx-auto">
        <Card>
          <Card.Header>
            <h3>Actions</h3>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Button
                  variant="primary"
                  className="btn-block w-100 mb-2"
                  onClick={() => handleStatusChange('Processing')}
                  disabled={order.status === 'Processing' || order.status === 'Delivered' || order.status === 'Cancelled'}
                >
                  Mark as Processing
                </Button>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  variant="primary"
                  className="btn-block w-100 mb-2"
                  onClick={() => handleStatusChange('Shipped')}
                  disabled={order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Cancelled'}
                >
                  Mark as Shipped
                </Button>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  variant="success"
                  className="btn-block w-100 mb-2"
                  onClick={handleDeliverOrder}
                  disabled={order.isDelivered || order.status === 'Cancelled'}
                >
                  Mark as Delivered
                </Button>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  variant="danger"
                  className="btn-block w-100"
                  onClick={() => handleStatusChange('Cancelled')}
                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                >
                  Cancel Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

};

export default OrderDetail;