import React, { useState } from 'react';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateToken = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setError('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testToken = async () => {
    if (!token) {
      setError('No token available');
      return;
    }
    
    try {
      const response = await fetch('/api/support', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setError('✅ Token is valid! Admin access granted.');
      } else {
        setError('❌ Token invalid or expired');
      }
    } catch (err) {
      setError('Test failed');
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ color: '#2563eb', marginBottom: '20px' }}>Admin Authentication Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
        <input
          type="text"
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="admin"
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="password"
        />
      </div>
      
      <button
        onClick={generateToken}
        disabled={loading || !credentials.username || !credentials.password}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        {loading ? 'Generating...' : 'Generate Token'}
      </button>
      
      {token && (
        <button
          onClick={testToken}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Token
        </button>
      )}
      
      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: error.includes('✅') ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${error.includes('✅') ? '#10b981' : '#ef4444'}`,
          borderRadius: '4px',
          color: error.includes('✅') ? '#065f46' : '#991b1b'
        }}>
          {error}
        </div>
      )}
      
      {token && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '4px'
        }}>
          <strong>Generated Token:</strong>
          <br />
          <code style={{
            fontSize: '12px',
            wordBreak: 'break-all',
            backgroundColor: '#e0f2fe',
            padding: '5px',
            borderRadius: '3px',
            display: 'block',
            marginTop: '5px'
          }}>
            {token}
          </code>
        </div>
      )}
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fef7cd',
        border: '1px solid #f59e0b',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Quick Demo:</strong>
        <br />
        Use username: <code>admin</code> and password: <code>password</code>
        <br />
        This will generate a JWT token for testing admin functionality.
      </div>
    </div>
  );
}