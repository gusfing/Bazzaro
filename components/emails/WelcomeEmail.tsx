
import React from 'react';
import { EmailLayout, buttonStyle } from './EmailLayout';

interface WelcomeEmailProps {
  customerName: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ customerName }) => {
  return (
    <EmailLayout previewText="Welcome to the BAZZARO Archive.">
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '32px', color: '#141414', marginBottom: '16px' }}>
        Welcome to the Archive
      </h1>
      <p style={{ marginBottom: '24px' }}>
        Hello {customerName},
      </p>
      <p style={{ marginBottom: '24px' }}>
        Thank you for creating an account with BAZZARO. We are a curated space where architectural precision meets timeless form. Each piece is a quiet statement, crafted for the discerning individual.
      </p>
      <p style={{ marginBottom: '32px' }}>
        We invite you to explore the collection and discover your next object of desire.
      </p>
      <div style={{ textAlign: 'center' }}>
        <a href="https://bazzaro.example.com/#/shop" style={buttonStyle}>
          Explore The Collection
        </a>
      </div>
    </EmailLayout>
  );
};

export default WelcomeEmail;
