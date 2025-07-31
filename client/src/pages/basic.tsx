export default function Basic() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <header style={{
          padding: '20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>SafetySync.AI</div>
          <div>
            <a href="#" style={{
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              cursor: 'pointer',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              marginRight: '10px'
            }}>Login</a>
            <a href="#" style={{
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              cursor: 'pointer',
              background: 'white',
              color: '#2563eb',
              border: 'none'
            }}>Get Started</a>
          </div>
        </header>
        
        <section style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            lineHeight: '1.2',
            fontWeight: 'bold'
          }}>OSHA Compliance, Automated for Every Role</h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '30px',
            opacity: 0.9
          }}>Whether you manage safety, support HR, or deliver training — SafetySync saves hours and keeps your business audit-ready.</p>
          <div>
            <a href="#" style={{
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              cursor: 'pointer',
              background: 'white',
              color: '#2563eb',
              border: 'none',
              marginRight: '15px'
            }}>Book a Demo</a>
            <a href="#" style={{
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              cursor: 'pointer',
              background: 'transparent',
              color: 'white',
              border: '2px solid white'
            }}>Start Free Trial</a>
          </div>
        </section>
      </div>

      <section style={{
        background: 'white',
        color: '#333',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '36px',
            marginBottom: '50px',
            color: '#2563eb'
          }}>Why Choose SafetySync?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              padding: '30px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>AI-Powered Processing</h3>
              <p>Extract, verify, and align training records with OSHA standards instantly using advanced AI technology.</p>
            </div>
            <div style={{
              padding: '30px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>Live Training Matrix</h3>
              <p>Auto-update training records, show progress by department, and stay inspection-ready at all times.</p>
            </div>
            <div style={{
              padding: '30px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>Digital Certificates</h3>
              <p>Generate QR-verifiable certificates and digital ID cards for every employee automatically.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        background: '#1e3a8a',
        textAlign: 'center',
        padding: '40px 20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p>© 2025 SafetySync.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}