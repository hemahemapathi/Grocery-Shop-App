import React, { createContext, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

// Create context
const OrderContext = createContext();

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

// Reducer function
const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ORDER_REQUEST':
      return { ...state, loading: true };
    case 'ORDER_SUCCESS':
      return { ...state, loading: false, currentOrder: action.payload, error: null };
    case 'ORDERS_LIST_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: null };
    case 'ORDER_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Create a new order
  const createOrder = async (orderData) => {
    try {
      dispatch({ type: 'ORDER_REQUEST' });
      const { data } = await api.createOrder(orderData);
      dispatch({ type: 'ORDER_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: 'ORDER_FAIL',
        payload: error.response?.data?.message || 'Failed to create order'
      });
      toast.error(error.response?.data?.message || 'Failed to create order');
      throw error;
    }
  };

  // Get order details
  const getOrderDetails = async (orderId) => {
    try {
      dispatch({ type: 'ORDER_REQUEST' });
      const { data } = await api.getOrderDetails(orderId);
      dispatch({ type: 'ORDER_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: 'ORDER_FAIL',
        payload: error.response?.data?.message || 'Failed to fetch order details'
      });
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
      throw error;
    }
  };

  // Get user's order history
  const getMyOrders = async () => {
    try {
      dispatch({ type: 'ORDER_REQUEST' });
      const { data } = await api.getMyOrders();
      dispatch({ type: 'ORDERS_LIST_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: 'ORDER_FAIL',
        payload: error.response?.data?.message || 'Failed to fetch orders'
      });
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
      throw error;
    }
  };

  // Pay for an order
  const payOrder = async (orderId, paymentResult) => {
    try {
      dispatch({ type: 'ORDER_REQUEST' });
      const { data } = await api.payOrder(orderId, paymentResult);
      dispatch({ type: 'ORDER_SUCCESS', payload: data });
      toast.success('Payment successful');
      return data;
    } catch (error) {
      dispatch({
        type: 'ORDER_FAIL',
        payload: error.response?.data?.message || 'Payment failed'
      });
      toast.error(error.response?.data?.message || 'Payment failed');
      throw error;
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId) => {
    try {
      dispatch({ type: 'ORDER_REQUEST' });
      const { data } = await api.cancelOrder(orderId);
      dispatch({ type: 'ORDER_SUCCESS', payload: data });
      toast.success('Order cancelled');
      return data;
    } catch (error) {
      dispatch({
        type: 'ORDER_FAIL',
        payload: error.response?.data?.message || 'Failed to cancel order'
      });
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        createOrder,
        getOrderDetails,
        getMyOrders,
        payOrder,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
