import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaCalendarAlt, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
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
      
      // Log the raw data to see what's coming from the API
      console.log('API Response:', data);
      
      // Handle different response formats
      const ordersData = Array.isArray(data) ? data : (data?.orders || []);
      
      console.log('Processed Orders Data:', ordersData);
      
      // Filter to only include paid orders
      const paidOrders = ordersData.filter(order => order.isPaid);
      
      console.log('Paid Orders:', paidOrders);
      
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
    // Log the orders being used for calculations
    console.log('Calculating revenue stats from orders:', orders);
    
    // Total revenue from all orders
    const totalRevenue = orders.reduce((sum, order) => {
      // Ensure totalPrice is a number
      const price = parseFloat(order.totalPrice) || 0;
      return sum + price;
    }, 0);
    
    console.log('Total Revenue:', totalRevenue);
    
    // Get current date for time-based calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
    
    console.log('Date ranges:', {
      today: today.toISOString(),
      weekStart: weekStart.toISOString(),
      monthStart: monthStart.toISOString()
    });
    
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
    
    console.log('Period Revenues:', {
      daily: dailyRevenue,
      weekly: weeklyRevenue,
      monthly: monthlyRevenue
    });
    
    // Calculate average order value
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    
    console.log('Order Count:', orderCount);
    console.log('Average Order Value:', averageOrderValue);
    
    // Update the state with the calculated values
    setRevenueStats({
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      dailyRevenue,
      orderCount,
      averageOrderValue
    });
    
    // Add this to verify the state is being updated
    console.log('Updated Revenue Stats:', {
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

  // Add this function to force a re-render if needed
  const refreshData = () => {
    fetchRevenueData();
  };

  return (
    <div className="py-3 revenue-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/dashboard" className="btn btn-light btn-sm mb-2">
            <FaArrowLeft className="me-1" /> Back to Dashboard
          </Link>
          <h2 className="mb-0">Revenue Analytics</h2>
        </div>
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={refreshData}>
            Refresh Data
          </Button>
          <Button variant="success" size="sm" onClick={exportToCSV}>
            <FaDownload className="me-1" /> Export to CSV
          </Button>
        </div>
      </div>
      
      {error && <Message variant="danger">{error}</Message>}
      
      {/* Date Range Filter */}
      <Card className="mb-3 filter-card">
        <Card.Body className="p-2">
          <Row className="align-items-center">
            <Col md={4} sm={12}>
              <h6 className="mb-0 filter-title"><FaCalendarAlt className="me-1" /> Filter by Date Range</h6>
            </Col>
            <Col md={8} sm={12} className="mt-md-0 mt-2">
              <Row>
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
      <Row className="mb-3 stats-row">
        <Col md={3} sm={6} className="mb-2">
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
        
        <Col md={3} sm={6} className="mb-2">
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
        
        <Col md={3} sm={6} className="mb-2">
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
        
        <Col md={3} sm={6} className="mb-2">
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
      
      <Row className="mb-3">
        <Col md={6} className="mb-2">
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
        
        <Col md={6} className="mb-2">
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
      <Card>
        <Card.Header>
          <h5 className="mb-0">Recent Orders (Paid Only)</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : orders.length === 0 ? (
            <Message>No paid orders found in the selected date range</Message>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(order._id.length - 6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.status}
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-info">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Revenue;

