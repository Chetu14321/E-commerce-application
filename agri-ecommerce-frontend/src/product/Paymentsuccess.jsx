import React from 'react';

const PaymentSuccess = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="text-success mb-3">🎉 Payment Successful!</h1>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
      <a className="btn btn-outline-primary mt-4" href="/">Go to Home</a>
    </div>
  );
};

export default PaymentSuccess;
