import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ size = 100 }) => {
  return (
    <div className="loader" style={{ textAlign: 'center', padding: '20px' }}>
      <Spinner
        animation="border"
        role="status"
        style={{
          width: size,
          height: size,
          margin: 'auto',
          display: 'block',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
