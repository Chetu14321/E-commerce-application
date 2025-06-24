import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Privacy Policy</h2>
      <p>
        We respect your privacy and are committed to protecting your personal data. 
        This Privacy Policy describes how we collect, use, and protect your information.
      </p>
      <h5>1. Information We Collect</h5>
      <ul>
        <li>Personal information (name, email, phone, etc.)</li>
        <li>Payment information (only through secured gateways)</li>
        <li>Usage data (pages visited, time spent, etc.)</li>
      </ul>
      <h5>2. How We Use Your Data</h5>
      <ul>
        <li>To process orders</li>
        <li>To provide customer support</li>
        <li>To improve our services</li>
      </ul>
      <h5>3. Data Security</h5>
      <p>
        We implement robust security measures to protect your data from unauthorized access.
      </p>
      <p>
        For any questions, contact: <strong>support@agrimart.com</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
