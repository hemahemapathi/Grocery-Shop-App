import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Form, Row, Col } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
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

  return (
      <div className="py-3 admin-container">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0">Users</h2>
          <p className="text-muted small-text">Total users: {users.length}</p>
        </Col>
      </Row>
      
      <Card className="mb-4 filter-card">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-primary ms-2">
                    <FaSearch />
                  </button>
                </Form.Group>
              </Col>
              <Col md={6} className="text-end">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Reset
                </button>
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
        <Card.Body className="p-2">
              {filteredUsers.length === 0 ? (
                <Message>No users found</Message>
              ) : (
                <div className="table-responsive">
                <Table hover className="compact-table">

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
                        <td>{user._id.substring(user._id.length - 6)}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.role === 'admin' ? (
                            <Badge bg="primary">Admin</Badge>
                          ) : (
                            <Badge bg="secondary">Customer</Badge>
                          )}
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
              <p className="mb-0">Showing {filteredUsers.length} of {users.length} users</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;