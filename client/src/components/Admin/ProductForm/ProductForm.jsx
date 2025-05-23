import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Initialize form with empty strings for numeric fields instead of 0
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
    description: '',
    isOrganic: false,
    discount: '',
    unit: 'piece'
  });

  // Fetch categories directly in this component instead of using context
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        console.log('Categories fetched:', data);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      
      // Set form data from product
      setFormData({
        name: data.name || '',
        price: data.price || '',
        image: data.image || '',
        brand: data.brand || '',
        category: data.category || '',
        countInStock: data.countInStock || '',
        description: data.description || '',
        isOrganic: data.isOrganic || false,
        discount: data.discount || '',
        unit: data.unit || 'piece'
      });
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string or convert to number
    setFormData({
      ...formData,
      [name]: value === '' ? '' : Number(value)
    });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploading(true);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const { data } = await api.post('/products/upload', formData, config);
      console.log('Uploaded image URL:', data);
      setFormData(prev => {
        const updated = {
          ...prev,
          image: data
        };
        console.log('Updated form data with image:', updated);
        return updated;
      });
      
      toast.success('Image uploaded successfully');
      setUploading(false);
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Error uploading image');
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.category || !formData.image) {
      setError('Please fill out all required fields (name, category, image)');
      toast.error('Please fill out all required fields');
      return;
    }
    
    // Prepare data for submission - convert empty strings to 0 for numeric fields
    const productData = {
      ...formData,
      price: formData.price === '' ? 0 : Number(formData.price),
      countInStock: formData.countInStock === '' ? 0 : Number(formData.countInStock),
      discount: formData.discount === '' ? 0 : Number(formData.discount),
      isOrganic: Boolean(formData.isOrganic)
    };
    
    console.log('Submitting product data:', productData);
    
    try {
      setLoading(true);
      
      if (id) {
        // Update existing product
        const response = await api.put(`/products/${id}`, productData);
        console.log('Server response:', response.data);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const response = await api.post('/products', productData);
        console.log('Server response:', response.data);
        toast.success('Product created successfully');
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Error saving product');
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <Loader />;
  }

  return (
    <div className="product-form-container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 form-title">{id ? 'Edit Product' : 'Create Product'}</h2>
        <Button 
          variant="light" 
          size="sm"
          onClick={() => navigate('/admin/products')}
          className="back-btn"
        >
          Go Back
        </Button>
      </div>
      
      {error && <Message variant="danger">{error}</Message>}
      
      <Card className="form-card mb-4">
        <Card.Body className="p-3 p-md-4">
          <Form onSubmit={submitHandler}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Name*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="price">
                  <Form.Label>Price*</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="g-3 mt-1">
              <Col md={6}>
                <Form.Group controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Category*</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category._id} {category.count > 0 ? `(${category.count})` : ''}
                        </option>
                      ))
                    ) : (
                      // Fallback options if no categories are loaded
                      <>
                        <option value="Fruits">Fruits</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Meat">Meat</option>
                        <option value="Beverages">Beverages</option>
                      </>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="g-3 mt-1">
              <Col md={6}>
                <Form.Group controlId="countInStock">
                  <Form.Label>Count In Stock*</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleNumberChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="unit">
                  <Form.Label>Unit*</Form.Label>
                  <Form.Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="lb">Pound (lb)</option>
                    <option value="oz">Ounce (oz)</option>
                    <option value="l">Liter (l)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="dozen">Dozen</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="g-3 mt-1">
              <Col md={6}>
                <Form.Group controlId="discount">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    name="discount"
                    value={formData.discount}
                    onChange={handleNumberChange}
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="isOrganic" className="mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Organic Product"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group controlId="image" className="mt-3">
              <Form.Label>Image*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL or upload"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
              <Form.Control
                type="file"
                label="Choose File"
                onChange={uploadFileHandler}
                className="mt-2"
              />
              {uploading && <Loader />}
              {formData.image && (
                <div className="mt-2 image-preview-container">
                  <img 
                    src={formData.image} 
                    alt="Product preview" 
                    className="image-preview" 
                  />
                </div>
              )}
            </Form.Group>
            
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter product description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-grid mt-4">
              <Button type="submit" variant="primary" disabled={loading} className="submit-btn">
                {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductForm;
