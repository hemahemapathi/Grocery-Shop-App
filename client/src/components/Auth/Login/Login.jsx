import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContext from '../../../context/AuthContext.jsx';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login({ email, password });
    
    if (success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container container mt-5 animate__animated animate__fadeIn">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h1 className="text-center mb-4">
                <FaSignInAlt className="me-2" /> Login
              </h1>
              <p className="text-center text-muted mb-4">Sign in to your account</p>
              
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                   type="email"
                   className="form-control"
                   id="email"
                   name="email"
                   value={email}
                   onChange={onChange}
                   autoComplete="username"
                   placeholder="Enter your email"
                   required
                  />

                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                  <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>


       <Form.Group className="mb-3 d-flex justify-content-between">
        <Form.Check 
            type="checkbox" 
           label="Remember me" 
           checked={rememberMe}
           onChange={(e) => setRememberMe(e.target.checked)}
          />
        <Link to="/forgot-password" className="text-decoration-none">
          Forgot Password?
           </Link>
        </Form.Group>

              
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-success fw-bold">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
