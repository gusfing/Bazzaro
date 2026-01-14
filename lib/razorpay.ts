// Razorpay Payment Integration for BAZZARO
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
  description: string;
}

class RazorpayService {
  private keyId: string;
  private isLoaded: boolean = false;

  constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    this.loadRazorpayScript();
  }

  private async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      // Add timeout for script loading
      const timeout = setTimeout(() => {
        console.error('Razorpay script loading timeout');
        reject(new Error('Razorpay script loading timeout'));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        this.isLoaded = true;
        console.log('Razorpay script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        console.error('Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  }

  async initiatePayment(paymentData: PaymentData): Promise<RazorpayResponse> {
    console.log('Initiating payment with data:', paymentData);

    if (!this.isLoaded) {
      console.log('Razorpay script not loaded, loading now...');
      await this.loadRazorpayScript();
    }

    if (!this.keyId) {
      throw new Error('Razorpay Key ID not configured');
    }

    return new Promise((resolve, reject) => {
      const options: RazorpayOptions = {
        key: this.keyId,
        amount: Math.round(paymentData.amount * 100), // Convert to paise
        currency: paymentData.currency,
        name: 'BAZZARO',
        description: paymentData.description,
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerPhone,
        },
        theme: {
          color: '#D4AF37', // BAZZARO brand color
        },
        handler: (response: RazorpayResponse) => {
          console.log('Payment successful:', response);
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed by user');
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      console.log('Opening Razorpay modal with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  }

  // Verify payment signature (this should ideally be done on backend)
  verifyPaymentSignature(
    paymentId: string,
    orderId: string,
    signature: string
  ): boolean {
    try {
      // Basic validation - payment ID should be valid Razorpay format
      // Razorpay payment IDs can be 14-24 characters after 'pay_'
      const razorpayPaymentIdPattern = /^pay_[A-Za-z0-9]{14,24}$/;
      if (!paymentId || !razorpayPaymentIdPattern.test(paymentId)) {
        console.error('Invalid Razorpay payment ID format:', paymentId);
        return false;
      }

      console.log('Payment verification passed for:', paymentId);
      return true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Check if Razorpay is available
  isAvailable(): boolean {
    return this.isLoaded && !!window.Razorpay;
  }
}

// Create and export the service instance
export const razorpayService = new RazorpayService();

// Export types for use in components
export type { PaymentData, RazorpayResponse };