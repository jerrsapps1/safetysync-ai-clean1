export default function LandingSimple() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #2563eb, #3b82f6, #60a5fa)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '2rem'
          }}>
            SafetySync.AI
          </h1>
          <p style={{
            fontSize: '2rem',
            color: 'white',
            marginBottom: '2rem'
          }}>
            AI-Powered Compliance Platform
          </p>
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <h2 style={{
              fontSize: '2rem',
              color: 'white',
              marginBottom: '1rem'
            }}>
              127+ companies joined the Lifer Plan
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: 'white'
            }}>
              Modern Safety Management, Made Simple
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button style={{
              background: '#2563eb',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 2rem',
              fontSize: '1rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: 'none',
              cursor: 'pointer'
            }}>
              Get Started Free
            </button>
            <button style={{
              background: 'transparent',
              border: '2px solid white',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 2rem',
              fontSize: '1rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}>
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}