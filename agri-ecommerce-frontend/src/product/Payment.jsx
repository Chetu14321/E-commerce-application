import React from 'react';

const Payment = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="text-success mb-4">💳 Payment Page</h1>
      <p className="lead">Payment gateway integration coming soon!</p>
      <button className="btn btn-primary mt-3" onClick={() => alert('Payment Successful')}>
        Pay ₹999
      </button>
    </div>
  );
};

export default Payment;
