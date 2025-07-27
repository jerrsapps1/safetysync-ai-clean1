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
      color: '#000000'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <h3 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#000000'
        }}>
          Still have questions?
        </h3>
        <p style={{ 
          marginBottom: '64px',
          color: '#000000',
          fontSize: '16px'
        }}>
          Our support team is here to help you with any questions about SafetySync or OSHA compliance requirements.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {/* Live Chat */}
          <div style={{ 
            backgroundColor: '#dbeafe', 
            borderRadius: '8px', 
            padding: '24px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h4 style={{ 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '18px'
            }}>
              Live Chat
            </h4>
            <p style={{ 
              fontSize: '14px', 
              marginBottom: '24px',
              color: '#000000'
            }}>
              Available 24/7
            </p>
            <button style={{ 
              backgroundColor: '#1d4ed8', 
              color: '#ffffff', 
              padding: '8px 16px', 
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Start Chat
            </button>
          </div>

          {/* Email Support */}
          <div style={{ 
            backgroundColor: '#dcfce7', 
            borderRadius: '8px', 
            padding: '24px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h4 style={{ 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '18px'
            }}>
              Email Support
            </h4>
            <p style={{ 
              fontSize: '14px', 
              marginBottom: '24px',
              color: '#000000'
            }}>
              Response within 2 hours
            </p>
            <button style={{ 
              backgroundColor: '#16a34a', 
              color: '#ffffff', 
              padding: '8px 16px', 
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Send Email
            </button>
          </div>

          {/* Premium Support */}
          <div style={{ 
            backgroundColor: '#faf5ff', 
            borderRadius: '8px', 
            padding: '24px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💎</div>
            <h4 style={{ 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '18px'
            }}>
              Premium Support
            </h4>
            <p style={{ 
              fontSize: '14px', 
              marginBottom: '24px',
              color: '#000000'
            }}>
              Available to paying customers
            </p>
            <button style={{ 
              backgroundColor: '#9333ea', 
              color: '#ffffff', 
              padding: '8px 16px', 
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}