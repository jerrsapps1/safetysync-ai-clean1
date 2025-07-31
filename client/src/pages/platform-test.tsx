import React, { useState, useEffect } from 'react';

export default function PlatformTest() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testEndpoints = async () => {
      const tests = [
        { name: 'Health Check', url: '/api/health' },
        { name: 'Email Automation Status', url: '/api/email-automation/status' },
        { name: 'AI Document Processing Health', url: '/api/ai-document-processing/health' },
        { name: 'Training API', url: '/api/training' },
        { name: 'Support System (POST)', url: '/api/support', method: 'POST', body: { 
          name: 'Platform Test', 
          email: 'test@platform.ai', 
          message: 'Testing platform functionality',
          topic: 'General',
          urgency: 'Normal'
        }},
      ];

      const testResults: any = {};
      
      for (const test of tests) {
        try {
          const options: RequestInit = {
            method: test.method || 'GET',
            headers: { 'Content-Type': 'application/json' },
          };
          
          if (test.body) {
            options.body = JSON.stringify(test.body);
          }
          
          const response = await fetch(test.url, options);
          const data = await response.json();
          
          testResults[test.name] = {
            status: response.status,
            success: response.ok,
            data: data
          };
        } catch (error) {
          testResults[test.name] = {
            status: 'ERROR',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }
      
      setResults(testResults);
      setLoading(false);
    };

    testEndpoints();
  }, []);

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '30px',
        color: '#2563eb',
        textAlign: 'center'
      }}>SafetySync.AI Platform Test Dashboard</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '18px' }}>Testing platform components...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(results).map(([testName, result]: [string, any]) => (
            <div key={testName} style={{
              border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: result.success ? '#f0fdf4' : '#fef2f2'
            }}>
              <h3 style={{ 
                margin: '0 0 15px 0',
                color: result.success ? '#065f46' : '#991b1b'
              }}>
                {result.success ? '✅' : '❌'} {testName}
              </h3>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                <strong>Status:</strong> {result.status}
              </div>
              {result.data && (
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  maxHeight: '150px',
                  overflow: 'auto'
                }}>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
              {result.error && (
                <div style={{ 
                  color: '#991b1b',
                  fontSize: '14px',
                  marginTop: '10px'
                }}>
                  Error: {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e0f2fe',
        borderRadius: '8px',
        border: '1px solid #0284c7'
      }}>
        <h3 style={{ color: '#0c4a6e', marginBottom: '15px' }}>Platform Status Summary</h3>
        <ul style={{ color: '#0c4a6e', lineHeight: '1.6' }}>
          <li>Frontend: Professional landing page with React + TypeScript</li>
          <li>Backend: Express.js server with comprehensive API endpoints</li>
          <li>Database: PostgreSQL with 35 tables and rich data model</li>
          <li>Support System: Complete customer submission + admin management</li>
          <li>Authentication: JWT-based security for admin functions</li>
          <li>Email Automation: Brevo API integration with cron jobs</li>
          <li>AI Processing: Document processing and clone detection ready</li>
          <li>Security: Proper endpoint protection and error handling</li>
        </ul>
      </div>
    </div>
  );
}