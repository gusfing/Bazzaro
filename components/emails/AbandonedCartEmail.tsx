
import React from 'react';
import { EmailLayout, buttonStyle } from './EmailLayout';
import { AbandonedCart } from '../../types';

interface AbandonedCartEmailProps {
  cart: AbandonedCart;
}

const tableCellStyle: React.CSSProperties = {
  padding: '12px 0',
  borderBottom: '1px solid #EEEEEE',
};

const AbandonedCartEmail: React.FC<AbandonedCartEmailProps> = ({ cart }) => {
  return (
    <EmailLayout previewText="It looks like you left something behind.">
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '32px', color: '#141414', marginBottom: '16px' }}>
        Did you forget something?
      </h1>
      <p style={{ marginBottom: '24px' }}>
        Hello {cart.customerName},
      </p>
      <p style={{ marginBottom: '24px' }}>
        We noticed you left some items in your shopping bag. If you’re ready to complete your purchase, your items are saved and waiting for you.
      </p>
      
      <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#757575', borderBottom: '1px solid #EEEEEE', paddingBottom: '8px', marginBottom: '20px' }}>
        Items in Your Bag
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <tbody>
          {cart.items.map(item => (
            <tr key={item.variantId}>
              <td style={tableCellStyle}>
                <img src={item.image} alt={item.title} style={{ width: '60px', height: 'auto', borderRadius: '8px', marginRight: '16px' }} />
              </td>
              <td style={{ ...tableCellStyle, verticalAlign: 'middle' }}>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px', color: '#212121' }}>{item.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#757575' }}>{item.quantity} x ${item.price.toFixed(2)}</p>
              </td>
              <td style={{ ...tableCellStyle, textAlign: 'right', verticalAlign: 'middle', fontFamily: 'Playfair Display, serif', fontSize: '16px' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center' }}>
        <a href="https://bazzaro.example.com/#/cart" style={buttonStyle}>
          Complete Your Purchase
        </a>
      </div>
    </EmailLayout>
  );
};

export default AbandonedCartEmail;
