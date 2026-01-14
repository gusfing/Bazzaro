// Production email service using Resend (Free Service - 3000 emails/month)
import { Resend } from 'resend';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Resend Configuration
const RESEND_CONFIG = {
  API_KEY: import.meta.env.VITE_RESEND_API_KEY || '',
  FROM_EMAIL: import.meta.env.VITE_FROM_EMAIL || 'noreply@bazzaro.com'
};

class EmailService {
  private resend: Resend | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (RESEND_CONFIG.API_KEY) {
      this.resend = new Resend(RESEND_CONFIG.API_KEY);
      this.initialized = true;
      console.log('Resend email service initialized successfully');
    } else {
      console.warn('Resend not configured. Please set VITE_RESEND_API_KEY');
    }
  }

  async sendEmail(params: EmailParams): Promise<EmailResponse> {
    if (!this.initialized || !this.resend) {
      console.error('Resend not initialized');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const response = await this.resend.emails.send({
        from: `BAZZARO <${RESEND_CONFIG.FROM_EMAIL}>`,
        to: params.to,
        subject: params.subject,
        html: params.html
      });

      if (response.error) {
        console.error('Email sending failed:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log('Email sent successfully:', response.data?.id);
      return { 
        success: true, 
        messageId: response.data?.id || 'sent'
      };

    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<EmailResponse> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #141414; text-align: center;">Welcome to BAZZARO, ${userName}!</h1>
        <p>Thank you for joining our community of design enthusiasts.</p>
        <p>Explore our collection of objects of desire and discover pieces that speak to your unique style.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/#/shop" 
             style="background: #141414; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Start Shopping
          </a>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <ul>
            <li>Browse our curated collection</li>
            <li>Create your wishlist</li>
            <li>Get personalized recommendations</li>
          </ul>
        </div>
        
        <p>Best regards,<br><strong>The BAZZARO Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          Need help? Contact us at <a href="mailto:support@bazzaro.com">support@bazzaro.com</a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to BAZZARO - Objects of Desire',
      html
    });
  }

  async sendOrderConfirmation(
    userEmail: string, 
    orderData: {
      orderId: string;
      customerName: string;
      items: any[];
      total: number;
      shippingAddress: string;
    }
  ): Promise<EmailResponse> {
    const itemsList = orderData.items.map(item => 
      `<tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">₹${item.price}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #141414; text-align: center;">Order Confirmation</h1>
        <p>Dear ${orderData.customerName},</p>
        <p>Thank you for your order! We're excited to get your items to you.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #141414; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Price</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="background: #f5f5f5; font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right;">Order Total:</td>
              <td style="padding: 12px; text-align: right;">₹${orderData.total}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Address:</h3>
          <p>${orderData.shippingAddress}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/#/orders/${orderData.orderId}" 
             style="background: #141414; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br><strong>The BAZZARO Team</strong></p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Order Confirmation - ${orderData.orderId}`,
      html
    });
  }

  async sendAbandonedCartEmail(
    userEmail: string,
    cartData: {
      customerName: string;
      items: any[];
      totalValue: number;
    }
  ): Promise<EmailResponse> {
    const itemsList = cartData.items.map(item => 
      `<div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
        <span><strong>${item.title}</strong></span>
        <span>₹${item.price}</span>
      </div>`
    ).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #141414; text-align: center;">Don't forget your items!</h1>
        <p>Hi ${cartData.customerName},</p>
        <p>You left these beautiful items in your bag. Complete your purchase before they're gone!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Items:</h3>
          ${itemsList}
          <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #141414; text-align: right;">
            <strong style="font-size: 18px;">Total: ₹${cartData.totalValue}</strong>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/#/cart" 
             style="background: #141414; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Complete Your Purchase
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This is a friendly reminder. If you're no longer interested, you can ignore this email.
        </p>
        
        <p>Best regards,<br><strong>The BAZZARO Team</strong></p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'You left something in your bag - BAZZARO',
      html
    });
  }

  async sendPasswordResetEmail(userEmail: string, resetLink: string): Promise<EmailResponse> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #141414; text-align: center;">Password Reset Request</h1>
        <p>Hi there,</p>
        <p>You requested to reset your password for your BAZZARO account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #141414; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Security Note:</strong> This link will expire in 1 hour for your security.
          </p>
        </div>
        
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>Need help? Contact us at <a href="mailto:support@bazzaro.com">support@bazzaro.com</a></p>
        
        <p>Best regards,<br><strong>The BAZZARO Team</strong></p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Reset Your BAZZARO Password',
      html
    });
  }

  async sendContactForm(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<EmailResponse> {
    // Send to admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #141414;">New Contact Form Submission</h1>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${formData.message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${formData.email}?subject=Re: ${formData.subject}" 
             style="background: #141414; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reply to Customer
          </a>
        </div>
      </div>
    `;

    const adminResponse = await this.sendEmail({
      to: 'admin@bazzaro.com',
      subject: `Contact Form: ${formData.subject}`,
      html: adminHtml
    });

    // Send confirmation to customer
    if (adminResponse.success) {
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #141414; text-align: center;">Thank you for contacting BAZZARO</h1>
          <p>Dear ${formData.name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your message:</h3>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
          
          <p>In the meantime, feel free to browse our collection or check out our FAQ section.</p>
          <p>Best regards,<br><strong>The BAZZARO Team</strong></p>
        </div>
      `;

      await this.sendEmail({
        to: formData.email,
        subject: 'We received your message - BAZZARO',
        html: customerHtml
      });
    }

    return adminResponse;
  }

  async sendAdminNotification(
    type: 'new_order' | 'low_stock' | 'customer_inquiry',
    data: Record<string, any>
  ): Promise<EmailResponse> {
    const subjects = {
      new_order: `🛍️ New Order Received - ${data.orderId}`,
      low_stock: `⚠️ Low Stock Alert - ${data.productName}`,
      customer_inquiry: `💬 Customer Inquiry - ${data.subject}`
    };

    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #141414;">BAZZARO Admin Notification</h1>
        <p><strong>Notification Type:</strong> ${type.replace('_', ' ').toUpperCase()}</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    `;

    if (data.orderId) {
      html += `
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Total:</strong> ₹${data.orderTotal}</p>
        <p><strong>Items:</strong> ${data.itemCount} items</p>
      `;
    }

    if (data.productName) {
      html += `
        <p><strong>Product:</strong> ${data.productName}</p>
        <p><strong>Current Stock:</strong> ${data.currentStock}</p>
        <p><strong>Threshold:</strong> ${data.threshold || 5}</p>
      `;
    }

    html += `
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/#/admin" 
             style="background: #141414; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Admin Panel
          </a>
        </div>
        
        <p>This is an automated notification from your BAZZARO admin system.</p>
      </div>
    `;

    return this.sendEmail({
      to: 'admin@bazzaro.com',
      subject: subjects[type],
      html
    });
  }
}

// Create and export the email service instance
export const emailService = new EmailService();

// Export for backward compatibility
export const productionEmailService = emailService;