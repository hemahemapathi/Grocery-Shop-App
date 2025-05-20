import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Form, Row, Col, Dropdown } from 'react-bootstrap';
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

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query string for filtering
      let queryParams = `?page=${currentPage}&limit=${itemsPerPage}&sort=createdAt`; // Removed the minus sign to reverse order
      
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
        setOrders(data.orders.reverse()); // Reverse the array to show recent orders first
        setTotalPages(data.pages || 1);
      } else {
        setOrders(Array.isArray(data) ? data.reverse() : []); // Reverse the array here too
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
    setCurrentPage(1); // Reset to first page when filter changes
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
    
      const renderPagination = () => {
        const pages = [];
        
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <Button
              key={i}
              variant={currentPage === i ? 'primary' : 'outline-primary'}
              onClick={() => setCurrentPage(i)}
              className="mx-1"
            >
              {i}
            </Button>
          );
        }
        
        return (
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mx-1"
            >
              Previous
            </Button>
            
            {pages}
            
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="mx-1"
            >
              Next
            </Button>
          </div>
        );
      };
    
      return (
        <div className="py-3 admin-container">
          <h2 className="mb-4">Orders Management</h2>
          
          {/* Filters */}
          <Card className="mb-3 filter-card">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Search</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type="text"
                        placeholder="Order ID or customer name"
                        name="search"
                        value={filter.search}
                        onChange={handleFilterChange}
                      />
                      <Button variant="outline-secondary">
                        <FaSearch />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filter.status}
                      onChange={handleFilterChange}
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
                
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateFrom"
                      value={filter.dateFrom}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateTo"
                      value={filter.dateTo}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={resetFilters} className="me-2">
                  Reset Filters
                </Button>
                <Button variant="primary" onClick={() => fetchOrders()}>
                  Apply Filters
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
              <Card className="data-card">
                <Card.Body className="p-2">
                  <div className="table-responsive">
                  <Table hover className="compact-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
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
                            <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-info me-2">
                              <FaEye />
                            </Link>
                            
                            <Dropdown className="d-inline">
                              <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-${order._id}`}>
                                Actions
                              </Dropdown.Toggle>
                              
                              <Dropdown.Menu>
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  </div>
                </Card.Body>
              </Card>
              
              {/* Pagination */}
              {totalPages > 1 && renderPagination()}
            </>
          )}
        </div>
      );
    };
    
    export default OrderList;