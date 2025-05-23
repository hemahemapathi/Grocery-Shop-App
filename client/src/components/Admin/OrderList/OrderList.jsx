import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Form, Row, Col, Dropdown, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and pagination
  const [filter, setFilter] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query string for filtering
      let queryParams = `?page=${currentPage}&limit=${itemsPerPage}&sort=createdAt`; 
      
      if (filter.status) {
        queryParams += `&status=${filter.status}`;
      }
      
      if (filter.dateFrom) {
        queryParams += `&dateFrom=${filter.dateFrom}`;
      }
      
      if (filter.dateTo) {
        queryParams += `&dateTo=${filter.dateTo}`;
      }
      
      if (filter.search) {
        queryParams += `&search=${filter.search}`;
      }
      
      const { data } = await api.get(`/orders${queryParams}`);
      
      // Handle different response formats
      if (data && data.orders) {
        setOrders(data.orders.reverse()); 
        setTotalPages(data.pages || 1);
      } else {
        setOrders(Array.isArray(data) ? data.reverse() : []); 
        setTotalPages(1);
      }
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilter({
      status: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating order status');
      console.error('Error updating order status:', err);
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/deliver`);
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, isDelivered: true, deliveredAt: new Date(), status: 'Delivered' } : order
      ));
      
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

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.put(`/orders/${orderId}/cancel`);
        
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        ));
        
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error cancelling order');
        console.error('Error cancelling order:', err);
      }
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'primary' : 'outline-primary'}
          onClick={() => setCurrentPage(i)}
          className="mx-1 pagination-btn"
          size="sm"
        >
          {i}
        </Button>
      );
    }
    
    return (
      <div className="d-flex justify-content-center mt-4 pagination-container">
        <Button
          variant="outline-primary"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-1 pagination-btn"
          size="sm"
        >
          Prev
        </Button>
        
        {pages}
        
        <Button
          variant="outline-primary"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="mx-1 pagination-btn"
          size="sm"
        >
          Next
        </Button>
      </div>
    );
  };

  // Order Details Modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    return (
      <Modal 
        show={showOrderDetails} 
        onHide={() => setShowOrderDetails(false)}
        size="lg"
        className="order-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Order #{selectedOrder._id.substring(selectedOrder._id.length - 6)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Order Information</h5>
                </Card.Header>
                <Card.Body>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Total:</strong> ${selectedOrder.totalPrice.toFixed(2)}</p>
                  <p>
                    <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p>
                    <strong>Payment:</strong> {selectedOrder.isPaid ? 
                      <Badge bg="success">Paid on {new Date(selectedOrder.paidAt).toLocaleString()}</Badge> : 
                      <Badge bg="danger">Not Paid</Badge>}
                  </p>
                  <p>
                    <strong>Delivery:</strong> {selectedOrder.isDelivered ? 
                      <Badge bg="success">Delivered on {new Date(selectedOrder.deliveredAt).toLocaleString()}</Badge> : 
                      <Badge bg="warning">Not Delivered</Badge>}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Customer Information</h5>
                </Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                  <h6 className="mt-3">Shipping Address:</h6>
                  {selectedOrder.shippingAddress && (
                    <div>
                      <p className="mb-1">{selectedOrder.shippingAddress.address}</p>
                      <p className="mb-1">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p className="mb-1">{selectedOrder.shippingAddress.country}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card className="mt-3">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems && selectedOrder.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} 
                            />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Items Price:</strong></td>
                    <td>${selectedOrder.itemsPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Shipping:</strong></td>
                    <td>${selectedOrder.shippingPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                    <td>${selectedOrder.taxPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>${selectedOrder.totalPrice.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              <Button 
                variant="danger" 
                onClick={() => handleCancelOrder(selectedOrder._id)}
                className="me-2"
                disabled={selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled'}
              >
                Cancel Order
              </Button>
            </div>
            <div>
              <Button 
                variant="secondary" 
                onClick={() => setShowOrderDetails(false)}
                className="me-2"
              >
                Close
              </Button>
              <Dropdown as="span">
                <Dropdown.Toggle variant="primary" id="status-dropdown">
                  Update Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStatusChange(selectedOrder._id, 'Processing')}>
                    Mark as Processing
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange(selectedOrder._id, 'Shipped')}>
                    Mark as Shipped
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeliverOrder(selectedOrder._id)}>
                    Mark as Delivered
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="py-3 admin-container order-list-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 order-list-title">Orders Management</h2>
        <Button 
          variant="outline-success" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
        >
          <FaFilter className="me-1" /> <span className="filter-text">Filters</span>
        </Button>
      </div>
      
      {/* Filters */}
      <Card className={`mb-3 filter-card ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
        <Card.Body className="p-3">
          <Row className="g-2">
            <Col md={3} sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">Search</Form.Label>
                <div className="input-group input-group-sm">
                  <Form.Control
                    type="text"
                    placeholder="Order ID or customer"
                                         name="search"
                    value={filter.search}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                  <Button variant="outline-secondary" size="sm">
                    <FaSearch />
                  </Button>
                </div>
              </Form.Group>
            </Col>
            
            <Col md={3} sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  size="sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3} sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateFrom"
                  value={filter.dateFrom}
                  onChange={handleFilterChange}
                  size="sm"
                />
              </Form.Group>
            </Col>
            
            <Col md={3} sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateTo"
                  value={filter.dateTo}
                  onChange={handleFilterChange}
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end mt-2">
            <Button variant="secondary" onClick={resetFilters} className="me-2 btn-sm">
              Reset
            </Button>
            <Button variant="primary" onClick={() => fetchOrders()} className="btn-sm">
              Apply
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Orders Table */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>No orders found</Message>
      ) : (
        <>
          {/* Desktop Table - Hidden on small screens */}
          <div className="d-none d-md-block desktop-table-container">
            <Card className="data-card">
              <Card.Body className="p-0">
                <Table hover responsive className="compact-table mb-0">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.substring(order._id.length - 6)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>
                          {order.isPaid ? (
                            <Badge bg="success">Paid</Badge>
                          ) : (
                            <Badge bg="danger">Not Paid</Badge>
                          )}
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              variant="info" 
                              size="sm" 
                              className="view-btn me-2"
                              title="View Order Details"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              <FaEye /> <span className="view-btn-text">Quick View</span>
                            </Button>
                            
                            <Link 
                              to={`/admin/orders/${order._id}`} 
                              className="btn btn-sm btn-primary view-btn me-2"
                              title="View Order Details Page"
                            >
                              <span className="view-btn-text">Full View</span>
                            </Link>
                            
                            <Dropdown className="action-dropdown-container">
                              <Dropdown.Toggle 
                                variant="secondary" 
                                size="sm" 
                                id={`dropdown-${order._id}`}
                                className="action-dropdown"
                              >
                                Actions
                              </Dropdown.Toggle>
                              
                              <Dropdown.Menu align="end" className="dropdown-menu-sm">
                                <Dropdown.Item onClick={() => handleStatusChange(order._id, 'Processing')}>
                                  Mark as Processing
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange(order._id, 'Shipped')}>
                                  Mark as Shipped
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDeliverOrder(order._id)}>
                                  Mark as Delivered
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="text-danger"
                                >
                                  Cancel Order
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
              {/* Add a footer to the desktop view */}
              <Card.Footer className="py-2 d-flex justify-content-between">
                <div>
                  <span className="text-muted">Total Orders: {orders.length}</span>
                </div>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.print()}
                    className="me-2"
                  >
                    Print Orders
                  </Button>
                  <Button variant="outline-success" size="sm">
                    Export to CSV
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </div>
          
          {/* Mobile Card View - Shown only on small screens */}
          <div className="d-md-none">
            {orders.map((order) => (
              <Card key={order._id} className="mb-3 order-card">
                <Card.Header className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <span className="order-id">#{order._id.substring(order._id.length - 6)}</span>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </Card.Header>
                <Card.Body className="py-2">
                  <Row className="mb-2">
                    <Col xs={5} className="text-muted">Customer:</Col>
                    <Col xs={7} className="text-truncate">{order.user?.name || 'N/A'}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={5} className="text-muted">Date:</Col>
                    <Col xs={7}>{new Date(order.createdAt).toLocaleDateString()}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={5} className="text-muted">Total:</Col>
                    <Col xs={7}>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={5} className="text-muted">Payment:</Col>
                    <Col xs={7}>
                      {order.isPaid ? (
                        <Badge bg="success">Paid</Badge>
                      ) : (
                        <Badge bg="danger">Not Paid</Badge>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="py-2 d-flex justify-content-between">
                  <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-info">
                    <FaEye className="me-1" /> View
                  </Link>
                  
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-mobile-${order._id}`}>
                      Actions
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu align="end">
                      <Dropdown.Item onClick={() => handleStatusChange(order._id, 'Processing')}>
                        Mark as Processing
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusChange(order._id, 'Shipped')}>
                        Mark as Shipped
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeliverOrder(order._id)}>
                        Mark as Delivered
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-danger"
                      >
                        Cancel Order
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Footer>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
          
          {/* Order Details Modal - Desktop Only */}
          <OrderDetailsModal />
        </>
      )}
    </div>
  );
};

export default OrderList;

