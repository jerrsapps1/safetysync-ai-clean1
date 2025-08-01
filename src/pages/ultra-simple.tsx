export default function UltraSimple() {
  return (
    <div style={{
      background: 'linear-gradient(to right, #2563eb, #3b82f6, #60a5fa)',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem'}}>
        SafetySync.AI
      </h1>
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>
          127+ companies joined the Lifer Plan
        </h2>
        <p style={{fontSize: '1.25rem', marginBottom: '1rem'}}>
          AI-Powered Compliance Platform
        </p>
        <p>Modern Safety Management, Made Simple</p>
      </div>
      <div style={{marginTop: '2rem'}}>
        <p>This is a basic React component with inline styles - testing if styling works at all.</p>
      </div>
    </div>
  );
}