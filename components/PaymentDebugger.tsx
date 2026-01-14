import React, { useState, useEffect } from 'react';
import { razorpayService } from '../lib/razorpay';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;

const PaymentDebugger: React.FC = () => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testPaymentStatus, setTestPaymentStatus] = useState<string>('');

  useEffect(() => {
    // Check Razorpay configuration
    const checkRazorpay = async () => {
      const info = {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID ? 'Configured' : 'Missing',
        scriptLoaded: razorpayService.isAvailable(),
        windowRazorpay: !!window.Razorpay,
        firebaseConfig: {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Configured' : 'Missing',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Configured' : 'Missing',
        }
      };
      setDebugInfo(info);
    };

    checkRazorpay();
  }, []);

  const testPayment = async () => {
    setTestPaymentStatus('Testing...');
    try {
      const testData = {
        amount: 100, // ₹1.00 for testing
        currency: 'INR',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9999999999',
        orderId: 'TEST-' + Date.now(),
        description: 'Test Payment'
      };

      console.log('Starting test payment with data:', testData);
      const response = await razorpayService.initiatePayment(testData);
      console.log('Test payment response:', response);
      setTestPaymentStatus('Payment successful: ' + response.razorpay_payment_id);
    } catch (error: any) {
      console.error('Test payment failed:', error);
      setTestPaymentStatus('Payment failed: ' + error.message);
    }
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Panel</h3>
      
      {/* Admin Access */}
      <button 
        onClick={goToAdmin}
        className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs mb-2 w-full"
      >
        🔧 Admin Panel
      </button>
      
      {/* Payment Debug Info */}
      <div className="space-y-1 mb-3 text-xs">
        <div>Razorpay Key: {debugInfo.keyId}</div>
        <div>Script Loaded: {debugInfo.scriptLoaded ? 'Yes' : 'No'}</div>
        <div>Window.Razorpay: {debugInfo.windowRazorpay ? 'Yes' : 'No'}</div>
        <div>Firebase API: {debugInfo.firebaseConfig?.apiKey}</div>
        <div>Firebase Project: {debugInfo.firebaseConfig?.projectId}</div>
      </div>
      
      <button 
        onClick={testPayment}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs mb-2 w-full"
      >
        Test Payment (₹1)
      </button>
      
      {testPaymentStatus && (
        <div className="text-xs bg-gray-800 p-2 rounded">
          {testPaymentStatus}
        </div>
      )}
    </div>
  );
};

export default PaymentDebugger;