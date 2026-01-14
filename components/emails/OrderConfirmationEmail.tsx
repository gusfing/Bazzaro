
import React from 'react';
import { EmailLayout, buttonStyle } from './EmailLayout';
import { Order } from '../../types';

interface OrderConfirmationEmailProps {
  order: Order;
}

const tableCellStyle: React.CSSProperties = {
  padding: '12px 0',
  borderBottom: '1px solid #EEEEEE',
};

const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({ order }) => {
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <EmailLayout previewText={`Your BAZZARO order ${order.id} is confirmed.`}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '32px', color: '#141414', marginBottom: '16px' }}>
        Thank You for Your Order
      </h1>
      <p style={{ marginBottom: '12px' }}>
        Hello {order.customerName},
      </p>
      <p style={{ marginBottom: '24px' }}>
        We've received your order and are getting it ready for shipment. You will receive another email once your order has shipped.
      </p>
      
      <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#757575', borderBottom: '1px solid #EEEEEE', paddingBottom: '8px', marginBottom: '20px' }}>
        Order Summary ({order.id})
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <tbody>
          {order.items.map(item => (
            <tr key={item.variantId}>
              <td style={tableCellStyle}>
                <img src={item.image} alt={item.title} style={{ width: '60px', height: 'auto', borderRadius: '8px', marginRight: '16px' }} />
              </td>
              <td style={{ ...tableCellStyle, verticalAlign: 'middle' }}>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px', color: '#212121' }}>{item.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#757575' }}>{item.color} / {item.size}</p>
              </td>
              <td style={{ ...tableCellStyle, textAlign: 'right', verticalAlign: 'middle', fontFamily: 'Playfair Display, serif', fontSize: '16px' }}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px', fontSize: '14px' }}>
        <tbody>
            <tr>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>Subtotal:</td>
                <td style={{ padding: '8px 0', textAlign: 'right', width: '100px' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            {order.walletCreditUsed && order.walletCreditUsed > 0 && (
                 <tr>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#4CAF50' }}>Wallet Credit:</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', width: '100px', color: '#4CAF50' }}>-₹{order.walletCreditUsed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            )}
            <tr>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>Shipping:</td>
                <td style={{ padding: '8px 0', textAlign: 'right', width: '100px', color: '#4CAF50' }}>FREE</td>
            </tr>
            <tr style={{ fontWeight: 'bold', color: '#212121' }}>
                <td style={{ padding: '8px 0', textAlign: 'right', borderTop: '1px solid #EEEEEE' }}>Total Paid:</td>
                <td style={{ padding: '8px 0', textAlign: 'right', width: '100px', borderTop: '1px solid #EEEEEE' }}>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
             {order.creditsEarned && order.creditsEarned > 0 && (
                <tr style={{ fontWeight: 'bold', color: '#A67B5B' }}>
                    <td style={{ paddingTop: '16px', textAlign: 'right' }}>Credits Earned:</td>
                    <td style={{ paddingTop: '16px', textAlign: 'right', width: '100px' }}>₹{order.creditsEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
             )}
        </tbody>
      </table>

      <div style={{ textAlign: 'center' }}>
        <a href="https://bazzaro.example.com/#/account" style={buttonStyle}>
          View Order Status
        </a>
      </div>
    </EmailLayout>
  );
};

export default OrderConfirmationEmail;
