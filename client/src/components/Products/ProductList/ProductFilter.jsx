import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaLeaf } from 'react-icons/fa';
import './ProductFilter.css';

const ProductFilter = ({ 
  showFilters, 
  setShowFilters, 
  localFilters, 
  handleFilterChange, 
  applyFilters, 
  handleResetFilters, 
  isFilterApplied, 
  categories 
}) => {
  return (
    <>
      {/* Filter Sidebar */}
      {showFilters && (
        <div className="filter-sidebar">
          <div className="filter-sidebar-header">
            <h5 className="mb-0">Filters</h5>
            <Button 
              variant="link" 
              className="p-0 text-dark" 
              onClick={() => setShowFilters(false)}
            >
              <i className="fa-solid fa-times"></i>
            </Button>
          </div>
          <div className="filter-sidebar-body">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search…"
                  name="keyword"
                  value={localFilters.keyword}
                  onChange={handleFilterChange}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Category</Form.Label>
                <Form.Select
                  name="category"
                  value={localFilters.category}
                  onChange={handleFilterChange}
                  className="form-select-custom"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c._id} ({c.count})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Price Range</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    className="me-2"
                    name="minPrice"
                    value={localFilters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    name="maxPrice"
                    value={localFilters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label={
                    <span className="d-flex align-items-center">
                      <FaLeaf className="text-success me-2" />
                      Organic Only
                    </span>
                  }
                                       name="organic"
                  checked={localFilters.organic}
                  onChange={handleFilterChange}
                  className="custom-checkbox"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Sort By</Form.Label>
                <Form.Select
                  name="sort"
                  value={localFilters.sort}
                  onChange={handleFilterChange}
                  className="form-select-custom"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-numReviews">Most Reviewed</option>
                </Form.Select>
              </Form.Group>
              
              <div className="d-grid gap-2 mt-4">
                <Button
                  variant="success"
                  onClick={applyFilters}
                  className="apply-filter-btn"
                >
                  Apply Filters
                </Button>
                {isFilterApplied && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}
      
      {/* Backdrop for filter sidebar on mobile */}
      {showFilters && (
        <div className="filter-backdrop" onClick={() => setShowFilters(false)}></div>
      )}
    </>
  );
};

export default ProductFilter;

