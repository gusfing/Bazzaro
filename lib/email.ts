
interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

// This is a mock SMTP client to simulate email sending in a frontend-only environment.
// In a real application, this would be a backend service using a library like Nodemailer.
const mockSmtpClient = {
  send: (params: EmailParams) => {
    console.log('%c--- 📧 Sending Email (Simulated) ---', 'color: #D4AF37; font-weight: bold;');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log('--- HTML Body ---');
    // Log a snippet to avoid flooding the console with massive HTML strings
    console.log(params.html.substring(0, 800) + '...');
    console.log('%c--- ✅ Email Sent ---', 'color: #4CAF50; font-weight: bold;');
    
    // Return a promise to mimic async behavior
    return Promise.resolve({ success: true, messageId: `mock_${Date.now()}` });
  }
};

export const sendEmail = async (params: EmailParams) => {
  try {
    // Here you would integrate with your actual email sending service API
    await mockSmtpClient.send(params);
  } catch (error) {
    console.error("Failed to send email (Simulated):", error);
    // You might want to throw the error or handle it gracefully
    throw error;
  }
};
