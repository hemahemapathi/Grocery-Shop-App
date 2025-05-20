import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from './AuthContext.jsx';

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  cartItems: [],
  totalPrice: 0,
  loading: false,
  error: null
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_REQUEST':
      return { ...state, loading: true };
    case 'CART_SUCCESS':
      return {
        ...state,
        loading: false,
        cartItems: action.payload.cartItems || [],
        totalPrice: action.payload.totalPrice || 0,
        error: null
      };
    case 'CART_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CART_RESET':
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      dispatch({ type: 'CART_RESET' });
    }
  }, [user]);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      dispatch({ type: 'CART_REQUEST' });
      const { data } = await api.get('/cart');
      dispatch({ type: 'CART_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'CART_FAIL',
        payload: error.response?.data?.message || 'Failed to fetch cart'
      });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!user) {
        toast.error('Please log in to add items to your cart');
        return;
      }

      dispatch({ type: 'CART_REQUEST' });
      const { data } = await api.post('/cart', { productId, quantity });
      dispatch({ type: 'CART_SUCCESS', payload: data });
      toast.success('Item added to cart');
    } catch (error) {
      dispatch({
        type: 'CART_FAIL',
        payload: error.response?.data?.message || 'Failed to add item to cart'
      });
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: 'CART_REQUEST' });
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      dispatch({ type: 'CART_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'CART_FAIL',
        payload: error.response?.data?.message || 'Failed to update cart'
      });
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'CART_REQUEST' });
      const { data } = await api.delete(`/cart/${itemId}`);
      dispatch({ type: 'CART_SUCCESS', payload: data });
      toast.success('Item removed from cart');
    } catch (error) {
      dispatch({
        type: 'CART_FAIL',
        payload: error.response?.data?.message || 'Failed to remove item from cart'
      });
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      dispatch({ type: 'CART_REQUEST' });
      await api.delete('/cart');
      dispatch({ type: 'CART_SUCCESS', payload: { cartItems: [], totalPrice: 0 } });
      toast.success('Cart cleared');
    } catch (error) {
      dispatch({
        type: 'CART_FAIL',
        payload: error.response?.data?.message || 'Failed to clear cart'
      });
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  // Calculate cart summary
  const getCartSummary = () => {
    const { cartItems, totalPrice } = state;
    const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const shippingPrice = totalPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * totalPrice).toFixed(2));
    const finalTotal = (totalPrice + shippingPrice + taxPrice).toFixed(2);

    return {
      itemsCount,
      subtotal: totalPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      total: finalTotal
    };
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartSummary
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
