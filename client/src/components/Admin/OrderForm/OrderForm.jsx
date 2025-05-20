import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './OrderForm.css';

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    isPaid: false,
    isDelivered: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    if (id && id !== 'create') {
      fetchOrder();
    } else {
      // Initialize with empty form data for creating a new order
      setFormData({
        status: 'Pending',
        isPaid: false,
        isDelivered: false
      });
      // Create a dummy order object for create mode
      setOrder({
        _id: 'new',
        status: 'Pending',
        isPaid: false,
        isDelivered: false,
        // Add other required fields with default values
      });
      setLoading(false);
    }
  }, [id]);
  

  

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
      setFormData({
        status: data.status,
        isPaid: data.isPaid,
        isDelivered: data.isDelivered
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isCreateMode) {
        toast.info('Creating new orders is not implemented yet');
      } else {
        // Update existing order
        await api.put(`/orders/${id}/status`, { status: formData.status });
       
        
        // Update payment status if changed
        if (formData.isPaid !== order.isPaid) {
          if (formData.isPaid) {
            await api.put(`/orders/${id}/pay`, {
              id: 'manual-payment',
              status: 'COMPLETED',
              update_time: new Date().toISOString(),
              payer: { email_address: 'admin@example.com' }
            });
          }
        }
        
        // Update delivery status if changed
        if (formData.isDelivered !== order.isDelivered) {
          if (formData.isDelivered) {
            await api.put(`/orders/${id}/deliver`);
          }
        }
        
        toast.success('Order updated successfully');
        navigate(`/admin/orders/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving order');
      console.error('Error saving order:', err);
      toast.error('Failed to save order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  // Modified condition to handle create mode
  
  if (!order && !isCreateMode) {
    return <Message>Order not found</Message>;
  }

  return (
    <div className="py-3">
      <Button 
        variant="light" 
        onClick={() => navigate('/admin/orders')}
        className="mb-3"
      >
        Go Back
      </Button>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h3>{isCreateMode ? 'Create New Order' : `Edit Order #${order._id}`}</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Mark as Paid"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Mark as Delivered"
                    name="isDelivered"
                    checked={formData.isDelivered}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                {isCreateMode && (
                  <p className="text-info">
                    Note: Creating new orders from the admin panel is not fully implemented.
                    This would typically require selecting a user, adding products, etc.
                  </p>
                )}
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={submitting}
                  className="w-100"
                >
                  {submitting ? 'Saving...' : isCreateMode ? 'Create Order' : 'Update Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          {!isCreateMode && order && (
            <>
              <Card className="mb-4">
                <Card.Header>
                  <h4>Order Summary</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items:</Col>
                      <Col className="text-end">${order.itemsPrice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col className="text-end">${order.shippingPrice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col className="text-end">${order.taxPrice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col className="text-end">${order.totalPrice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              
              <Card className="mb-4">
                <Card.Header>
                  <h4>Customer Information</h4>
                </Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {order.user?.name}</p>
                  <p><strong>Email:</strong> {order.user?.email}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  <p>
                    <strong>Payment Status:</strong>{' '}
                    {order.isPaid ? (
                      <Badge bg="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Badge>
                    ) : (
                      <Badge bg="danger">Not Paid</Badge>
                    )}
                  </p>
                  <p>
                    <strong>Delivery Status:</strong>{' '}
                    {order.isDelivered ? (
                      <Badge bg="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Badge>
                    ) : (
                      <Badge bg="danger">Not Delivered</Badge>
                    )}
                  </p>
                </Card.Body>
              </Card>
            </>
          )}
          
          {isCreateMode && (
            <Card>
              <Card.Header>
                <h4>Create Order Instructions</h4>
              </Card.Header>
              <Card.Body>
                <p>To create a new order, you would typically need to:</p>
                <ol>
                  <li>Select a customer</li>
                  <li>Add products to the order</li>
                  <li>Set shipping details</li>
                  <li>Calculate totals</li>
                </ol>
                <p>This functionality would need to be implemented based on your specific requirements.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default OrderForm;
