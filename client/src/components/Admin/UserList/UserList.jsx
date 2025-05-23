import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FaSearch, FaSync, FaUserEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users when searchTerm changes
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('auth/users');
      
      // Handle different response formats and sort by date
      let sortedUsers;
      if (Array.isArray(data)) {
        sortedUsers = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } else if (data && data.users) {
        sortedUsers = [...data.users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is handled in the useEffect
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  return (
    <div className="py-3 admin-container user-list-container">
      <Row className="align-items-center mb-3">
        <Col xs={8} md={6}>
          <h2 className="mb-0 user-list-title">Users</h2>
          <p className="text-muted small-text">Total users: {users.length}</p>
        </Col>
        <Col xs={4} md={6} className="text-end">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="refresh-btn"
          >
            {refreshing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                <span className="refresh-text">Refreshing...</span>
              </>
            ) : (
              <>
                <FaSync className="me-1" /> <span className="refresh-text">Refresh</span>
              </>
            )}
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4 filter-card">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <Row className="align-items-center">
              <Col md={6} className="mb-2 mb-md-0">
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <Button type="submit" variant="outline-primary" className="ms-2 search-btn">
                    <FaSearch />
                  </Button>
                </Form.Group>
              </Col>
              <Col md={6} className="text-md-end">
                <Button 
                  type="button" 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                  className="reset-btn"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Card className="data-card">
            <Card.Body className="p-0">
              {filteredUsers.length === 0 ? (
                <Message>No users found</Message>
              ) : (
                <div className="table-responsive">
                  <Table hover className="user-table mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="user-id">{user._id.substring(user._id.length - 6)}</td>
                          <td className="user-name">{user.name}</td>
                          <td className="user-email">{user.email}</td>
                          <td className="user-role">
                            {user.role === 'admin' ? (
                              <Badge bg="primary">Admin</Badge>
                            ) : (
                              <Badge bg="secondary">Customer</Badge>
                            )}
                          </td>
                          <td className="user-date">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <p className="mb-0 results-text">Showing {filteredUsers.length} of {users.length} users</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
