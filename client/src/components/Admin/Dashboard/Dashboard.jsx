import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Tabs, Tab, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaEdit, FaSync } from 'react-icons/fa';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state

  // Set up polling for dashboard data
  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshKey]); // Add refreshKey as a dependency

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use individual try-catch blocks for each API call to handle errors separately
      let orders = [];
      let products = [];
      let users = [];
      
      try {
        const ordersResponse = await api.get('/orders');
        orders = Array.isArray(ordersResponse.data) 
          ? ordersResponse.data 
          : (ordersResponse.data?.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      
      try {
        const productsResponse = await api.get('/products');
        products = Array.isArray(productsResponse.data) 
          ? productsResponse.data 
          : (productsResponse.data?.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
      
      try {
        // This is the key change - using the correct endpoint for users
        const usersResponse = await api.get('/auth/users');
        
        // Handle different possible response formats
        if (Array.isArray(usersResponse.data)) {
          users = usersResponse.data;
        } else if (usersResponse.data && Array.isArray(usersResponse.data.users)) {
          users = usersResponse.data.users;
        } else {
          // If we can't determine the format, log it for debugging
          console.log('User response format:', usersResponse.data);
          users = [];
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
      
      // Calculate stats
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const totalUsers = users.length;
      
      // Calculate revenue from orders
      const totalRevenue = orders.reduce((sum, order) => 
        sum + (order.isPaid ? (order.totalPrice || 0) : 0), 0);
      
      // Set the calculated stats
      setStats({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue
      });
      
      // Set recent orders - sort by createdAt date in descending order
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentOrders(sortedOrders.slice(0, 5));
      
      // Set low stock products
      const lowStock = products
        .filter(p => (p.countInStock || 0) < 5)
        .slice(0, 5);
      setLowStockProducts(lowStock);
      
      // Set top products (sorting by rating as a proxy for popularity)
      const sortedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTopProducts(sortedProducts.slice(0, 5));
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh dashboard data
  const refreshDashboard = () => {
    setRefreshKey(prevKey => prevKey + 1); // Increment refresh key to trigger useEffect
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

  return (
      <div className="admin-dashboard compact-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Admin Dashboard</h2>
           <Button 
             variant="outline-primary" 
             size="sm"
             onClick={refreshDashboard}
            disabled={loading}
         >
         {loading ? (
        <>
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
          Refreshing...
        </>
      ) : (
        <>
          <FaSync className="me-1" /> Refresh Data
        </>
      )}
    </Button>
      </div>
      
      {error && <Message variant="danger">{error}</Message>}
      
      {/* Stats Cards */}
      <Row className="mb-3 stats-row">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="card-title">Orders</h2>
                </div>
                <div className="dashboard-icon orders-icon">
                  <FaShoppingCart />
                </div>
              </div>
              <Link to="/admin/orders" className="stretched-link"></Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="card-title">Products</h2>
                </div>
                <div className="dashboard-icon products-icon">
                  <FaBox />
                </div>
              </div>
              <Link to="/admin/products" className="stretched-link"></Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title">Users</h2>
                </div>
                <div className="dashboard-icon users-icon">
                  <FaUsers />
                </div>
              </div>
              <Link to="/admin/users" className="stretched-link"></Link>
            </Card.Body>
          </Card>
        </Col>
        
      
<Col md={3}>
  <Card className="dashboard-card">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div>
            <h2 className="card-title">Total Revenue</h2>
        </div>
        <div className="dashboard-icon revenue-icon">
          <FaDollarSign />
        </div>
      </div>
      
      <Link to="/admin/revenue" className="stretched-link"></Link>
    </Card.Body>
  </Card>
</Col>

      </Row>
      
      {/* Tabs for different sections */}
      <Tabs defaultActiveKey="orders" className="mb-4">
        {/* Recent Orders Tab */}
        <Tab eventKey="orders" title="Recent Orders">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Orders</h5>
                <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : recentOrders.length === 0 ? (
                <Message>No recent orders found</Message>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.substring(order._id.length - 6)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-info me-2">
                            <FaEdit />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Top Products Tab */}
        <Tab eventKey="top-products" title="Top Products">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top Selling Products</h5>
                <Link to="/admin/products" className="btn btn-sm btn-outline-primary">
                  View All Products
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : topProducts.length === 0 ? (
                <Message>No product data available</Message>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="product-thumbnail me-2" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/products/default.jpg';
                              }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>${product.price?.toFixed(2) || '0.00'}</td>
                        <td>{product.rating?.toFixed(1) || '0.0'}</td>
                        <td>{product.countInStock || 0}</td>
                        <td>
                          <Link to={`/admin/products/${product._id}/edit`} className="btn btn-sm btn-info me-2">
                            <FaEdit />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Low Stock Tab */}
        <Tab eventKey="low-stock" title="Low Stock">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Low Stock Products</h5>
                <Link to="/admin/products" className="btn btn-sm btn-outline-primary">
                  Manage Inventory
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                                ) : lowStockProducts.length === 0 ? (
                <Message variant="success">All products are well stocked</Message>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Current Stock</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="product-thumbnail me-2" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/products/default.jpg';
                              }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg={product.countInStock === 0 ? 'danger' : 'warning'}>
                            {product.countInStock || 0} in stock
                          </Badge>
                        </td>
                        <td>${product.price?.toFixed(2) || '0.00'}</td>
                        <td>
                          <Link to={`/admin/products/${product._id}/edit`} className="btn btn-sm btn-info me-2">
                            <FaEdit />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Dashboard;
