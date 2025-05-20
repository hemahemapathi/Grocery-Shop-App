import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaLeaf, FaRegHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

const ProductGrid = ({ 
  products, 
  calculateDiscountedPrice, 
  handleAddToCart, 
  handleUpdateQty, 
  toggleFav, 
  isInFavorites, 
  getCartItem 
}) => {
  

  // Local state to track quantity selection before adding to cart
  const [quantities, setQuantities] = useState({});


  const renderRating = r => {
    const f = Math.floor(r);
    const h = r % 1 >= 0.5;
    const e = 5 - f - (h ? 1 : 0);
    return (
      <>
        {[...Array(f)].map((_, i) => <FaStar key={'f' + i} className="text-warning" />)}
        {h && <FaStarHalfAlt className="text-warning" />}
        {[...Array(e)].map((_, i) => <FaRegStar key={'e' + i} className="text-warning" />)}
      </>
    );
  };

  // Handle quantity change before adding to cart
  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [productId]: newQty };
    });
  };

  // Add to cart with selected quantity
  const addToCartWithQuantity = (product) => {
    const qty = quantities[product._id] || 0;
    if (qty > 0) {
      handleAddToCart(product, qty);
      // Reset quantity after adding to cart
      setQuantities(prev => ({ ...prev, [product._id]: 0 }));
    }
  };

  return (
    <div className="product-grid">
      {products.map(p => {
        const cartItem = getCartItem(p._id);
        const inCart = !!cartItem;
        const cartQty = inCart ? cartItem.qty : 0;
        const selectedQty = quantities[p._id] || 0;

     
        
        return (
          <div key={p._id} className="product-card-wrapper">
            <Card className="product-card">
              <div className="product-image-container">
                {p.discount > 0 && (
                  <div className="discount-badge">{p.discount}%</div>
                )}
                {p.isOrganic && (
                  <div className="organic-badge"><FaLeaf /></div>
                )}
                <a href={`/product/${p._id}`}>
                  <Card.Img 
                    src={p.imageUrl || p.image} 
                    alt={p.name} 
                    className="product-image"
                  />
                </a>
              </div>
              
              <Card.Body className="product-card-body">
                 {/* Top corners container */}
                <div className="top-corners-container">
                {inCart ? (
               <div className="cart-info-corner">
              <span className="in-cart-badge">{cartQty} in cart</span>
             </div>
             ) : (
            <div className="empty-corner"></div> /* Empty placeholder to maintain layout */
            )}
  
                 <Button 
                    variant="link" 
                    className={`favorite-btn-corner ${isInFavorites(p._id) ? 'favorited' : ''}`}
                    onClick={() => toggleFav(p._id)}
                    title={isInFavorites(p._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    {isInFavorites(p._id) ? <FaHeart /> : <FaRegHeart />}
                  </Button>
        </div>

              
                
                <Card.Title className="product-title">
                  <a href={`/product/${p._id}`} className="product-link">
                    {p.name}
                  </a>
                </Card.Title>

                  
                <div className="rating-container">
                  {renderRating(p.rating)}
                  <span className="ms-1 rating-count">({p.numReviews || 0})</span>
                </div>
                
                <div className="price-container">
                  {p.discount > 0 ? (
                    <>
                      <span className="original-price">${p.price.toFixed(2)}</span>
                      <span className="offer-price">${calculateDiscountedPrice(p.price, p.discount)}</span>
                    </>
                  ) : (
                    <span className="regular-price">${p.price.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="quantity-selection">
                  <div className="quantity-stepper">
                    <Button 
                      variant="outline-success" 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(p._id, -1)}
                      disabled={selectedQty === 0}
                    >
                      <FaMinus />
                    </Button>
                    <span className="qty-display">{selectedQty}</span>
                    <Button 
                      variant="outline-success" 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(p._id, 1)}
                      disabled={selectedQty >= p.countInStock}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                </div>
                
                <div className="add-to-cart-container">
                  <Button 
                    variant="success" 
                    className="add-to-cart-btn"
                    onClick={() => addToCartWithQuantity(p)}
                    disabled={p.countInStock === 0 || selectedQty === 0}
                  >
                    {p.countInStock === 0 ? 'Out' : 'Add to Cart'}
                  </Button>
                </div>
                
                <div className="meta-info">
                  <span></span>
                  {p.countInStock <= 5 && p.countInStock > 0 && (
                    <span className="stock-info">Only {p.countInStock} left</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        );
      })}
     
    </div>
  );
};

export default ProductGrid;
