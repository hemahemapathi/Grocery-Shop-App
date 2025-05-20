import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCog, FaSignOutAlt, FaStore, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin" className="d-flex align-items-center">
          <FaStore className="me-2" size={24} />
          <span className="fw-bold">Admin Panel</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin" className="d-flex align-items-center">
              <FaTachometerAlt className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/admin/orders">Orders</Nav.Link>
            <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
            <Nav.Link as={Link} to="/admin/revenue">Revenue</Nav.Link>
          </Nav>
          
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="admin-dropdown" className="d-flex align-items-center">
                <FaUserCog className="me-2" />
                {user?.name || 'Admin'}
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/profile">Admin Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/" className="text-primary">View Store</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
