import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaCalendarAlt, FaDollarSign, FaShoppingCart, FaSync } from 'react-icons/fa';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './Revenue.css';

const Revenue = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0
  });
  
  // Date filters
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], // Default to last month
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with date range filter
      const { data } = await api.get(`/orders?dateFrom=${dateRange.startDate}&dateTo=${dateRange.endDate}`);
      
      // Handle different response formats
      const ordersData = Array.isArray(data) ? data : (data?.orders || []);
      
      // Filter to only include paid orders
      const paidOrders = ordersData.filter(order => order.isPaid);
      
      // Sort orders by date (newest first)
      const sortedOrders = paidOrders.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
      
      // Calculate revenue statistics
      calculateRevenueStats(paidOrders);
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching revenue data');
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenueStats = (orders) => {
    // Total revenue from all orders
    const totalRevenue = orders.reduce((sum, order) => {
      // Ensure totalPrice is a number
      const price = parseFloat(order.totalPrice) || 0;
      return sum + price;
    }, 0);
    
    // Get current date for time-based calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
    
    // Calculate revenue for different time periods
    const dailyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today;
      })
      .reduce((sum, order) => sum + (parseFloat(order.totalPrice) || 0), 0);
      
    const weeklyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekStart;
      })
      .reduce((sum, order) => sum + (parseFloat(order.totalPrice) || 0), 0);
      
    const monthlyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart;
      })
      .reduce((sum, order) => sum + (parseFloat(order.totalPrice) || 0), 0);
    
    // Calculate average order value
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    
    // Update the state with the calculated values
    setRevenueStats({
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      dailyRevenue,
      orderCount,
      averageOrderValue
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const exportToCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Date,Customer,Total\n";
    
    orders.forEach(order => {
      const row = [
        order._id,
        new Date(order.createdAt).toLocaleDateString(),
        order.user?.name || 'N/A',
        `${order.totalPrice.toFixed(2)}`
      ].join(",");
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="revenue-container super-compact-revenue">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/dashboard" className="btn btn-light btn-sm mb-2">
            <FaArrowLeft className="me-1" /> <span className="back-text">Back to Dashboard</span>
          </Link>
          <h2 className="mb-0 revenue-title">Revenue Analytics</h2>
        </div>
        <div>
          <Button variant="outline-primary" size="sm" className="me-2 refresh-btn" onClick={fetchRevenueData}>
            <FaSync className="me-1" /> <span className="refresh-text">Refresh</span>
          </Button>
          <Button variant="success" size="sm" className="export-btn" onClick={exportToCSV}>
            <FaDownload className="me-1" /> <span className="export-text">Export</span>
          </Button>
        </div>
      </div>
      
      {error && <Message variant="danger">{error}</Message>}
      
      {/* Date Range Filter */}
      <Card className="mb-3 filter-card">
        <Card.Body className="p-2">
          <Row className="align-items-center g-2">
            <Col md={4} sm={12}>
              <h6 className="mb-0 filter-title"><FaCalendarAlt className="me-1" /> Filter by Date Range</h6>
            </Col>
            <Col md={8} sm={12}>
              <Row className="g-2">
                <Col xs={6}>
                  <Form.Group className="mb-0">
                    <Form.Label className="small-label">From:</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateChange}
                      size="sm"
                      className="date-input"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-0">
                    <Form.Label className="small-label">To:</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateChange}
                      size="sm"
                      className="date-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Revenue Stats Cards */}
      <Row className="mb-3 stats-row g-2">
        <Col md={3} sm={6} xs={6}>
          <Card className="compact-card">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-subtitle text-muted mb-1">Total Revenue</p>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h4 className="card-title">${revenueStats.totalRevenue.toFixed(2)}</h4>
                  )}
                </div>
                <div className="dashboard-icon revenue-icon">
                  <FaDollarSign />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} xs={6}>
          <Card className="compact-card">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-subtitle text-muted mb-1">Monthly Revenue</p>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h4 className="card-title">${revenueStats.monthlyRevenue.toFixed(2)}</h4>
                  )}
                </div>
                <div className="dashboard-icon orders-icon">
                  <FaCalendarAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} xs={6}>
          <Card className="compact-card">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-subtitle text-muted mb-1">Weekly Revenue</p>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h4 className="card-title">${revenueStats.weeklyRevenue.toFixed(2)}</h4>
                  )}
                </div>
                <div className="dashboard-icon products-icon">
                  <FaCalendarAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} xs={6}>
          <Card className="compact-card">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-subtitle text-muted mb-1">Daily Revenue</p>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h4 className="card-title">${revenueStats.dailyRevenue.toFixed(2)}</h4>
                  )}
                </div>
                <div className="dashboard-icon users-icon">
                  <FaCalendarAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-3 g-2">
        <Col md={6} xs={6}>
          <Card className="compact-card">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-subtitle text-muted mb-1">Total Orders</p>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h4 className="card-title">{revenueStats.orderCount}</h4>
                  )}
                </div>
                <div className="dashboard-icon orders-icon">
                  <FaShoppingCart />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} xs={6}>
          <Card className="compact-card">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-subtitle text-muted mb-1">Average Order Value</p>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h4 className="card-title">${revenueStats.averageOrderValue.toFixed(2)}</h4>
                  )}
                </div>
                <div className="dashboard-icon revenue-icon">
                  <FaDollarSign />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Orders Table */}
      <Card className="orders-table-card">
        <Card.Header className="py-2 px-3">
            <div className="d-flex justify-content-between align-items-center">
      <h5 className="mb-0 table-title">Recent Orders (Paid Only)</h5>
      <Link to="/admin/all-orders" className="btn btn-sm btn-outline-primary">
        View All Orders
      </Link>
    </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-3">
              <Message>No paid orders found in the selected date range</Message>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="compact-table mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th className="date-col">Date</th>
                    <th className="customer-col">Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.substring(order._id.length - 6)}</td>
                      <td className="date-col">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="customer-col">{order.user?.name || 'N/A'}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.status}
                      </td>
                      <td>
                          <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-outline-primary view-btn">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Revenue;

