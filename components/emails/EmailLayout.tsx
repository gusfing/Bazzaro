
import React from 'react';

// --- INLINE STYLES ---
// Using inline styles for maximum email client compatibility.

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#F0EEE9',
  fontFamily: 'Inter, -apple-system, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingBottom: '20px',
  borderBottom: '1px solid #E0E0E0',
};

const mainStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '40px',
  borderRadius: '16px',
  border: '1px solid #EEEEEE',
  marginTop: '20px'
};

const contentStyle: React.CSSProperties = {
  color: '#424242',
  fontSize: '14px',
  lineHeight: '1.6',
};

const footerStyle: React.CSSProperties = {
  padding: '20px',
  textAlign: 'center',
  fontSize: '12px',
  color: '#9E9E9E',
};

const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#141414',
    color: '#FAFAFA',
    padding: '16px 32px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '12px'
};

// --- COMPONENT ---

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ previewText, children }) => {
  return (
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>BAZZARO</title>
        {/* Gmail/Inbox preview text */}
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
          {previewText}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;...
        </div>
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          <header style={headerStyle}>
            <img 
              src="https://i.imgur.com/3Y01s3D.png" // Using an absolute URL for email clients
              alt="BAZZARO" 
              style={{ height: '20px', width: 'auto', objectFit: 'contain' }}
            />
          </header>
          <main style={mainStyle}>
            <div style={contentStyle}>
              {children}
            </div>
          </main>
          <footer style={footerStyle}>
            <p>&copy; {new Date().getFullYear()} BAZZARO. Objects of Desire.</p>
            <p>Via Montenapoleone, 8, 20121 Milano MI, Italy</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

// Exporting button style for use in other email components
export { buttonStyle };
