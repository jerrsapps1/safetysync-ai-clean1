import React from 'react';

export default function SupportSection() {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      padding: '48px 24px', 
      borderRadius: '12px', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
      maxWidth: '80rem', 
      margin: '40px auto',
      color: '#000000',
      position: 'relative',
      zIndex: 10,
      border: '3px solid #000000'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <h3 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#000000',
          textShadow: '1px 1px 1px #ffffff',
          border: '1px solid #000000',
          padding: '8px',
          backgroundColor: '#f0f0f0'
        }}>
          Still have questions?
        </h3>
        <p style={{ 
          marginBottom: '64px',
          color: '#000000',
          fontSize: '16px',
          border: '1px solid #000000',
          padding: '8px',
          backgroundColor: '#f0f0f0'
        }}>
          Our support team is here to help you with any questions about SafetySync or OSHA compliance requirements.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '32px' 
        }}>
          {/* Live Chat */}
          <div style={{ 
            backgroundColor: '#dbeafe', 
            borderRadius: '8px', 
            padding: '32px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h4 style={{ 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '20px'
            }}>
              Live Chat
            </h4>
            <p style={{ 
              fontSize: '16px', 
              marginBottom: '24px',
              color: '#000000'
            }}>
              Available 24/7 for immediate assistance
            </p>
            <button style={{ 
              backgroundColor: '#1d4ed8', 
              color: '#ffffff', 
              padding: '12px 24px', 
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Start Chat
            </button>
          </div>

          {/* Email Support */}
          <div style={{ 
            backgroundColor: '#dcfce7', 
            borderRadius: '8px', 
            padding: '32px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h4 style={{ 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '20px'
            }}>
              Email Support
            </h4>
            <p style={{ 
              fontSize: '16px', 
              marginBottom: '24px',
              color: '#000000'
            }}>
              Response within 2 hours during business hours
            </p>
            <button style={{ 
              backgroundColor: '#16a34a', 
              color: '#ffffff', 
              padding: '12px 24px', 
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}