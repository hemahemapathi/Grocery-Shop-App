// Function to format a number as currency
export const formatCurrency = (number, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(number);
  };
  
  // Function to calculate the total price of items in a cart
  export const calculateCartTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Function to generate a random ID
  export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  // Function to truncate a string to a certain length
  export const truncateString = (str, maxLength) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  };
  
  // Function to format a date
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Function to check if an object is empty
  export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  // Function to validate email format
  export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Function to validate password strength (example: at least 8 characters, one uppercase, one lowercase, one number)
  export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Function to sort an array of objects by a specific key
  export const sortBy = (arr, key) => {
    return [...arr].sort((a, b) => (a[key] > b[key] ? 1 : -1));
  };
  
  // Function to filter an array of objects based on a search term and keys to search in
  export const filterBySearchTerm = (arr, searchTerm, keys) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return arr.filter((item) => {
      return keys.some((key) => {
        if (item[key] === null || item[key] === undefined) {
          return false;
        }
        return item[key].toString().toLowerCase().includes(lowerSearchTerm);
      });
    });
  };
  