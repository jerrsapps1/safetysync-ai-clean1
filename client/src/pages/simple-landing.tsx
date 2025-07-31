export default function SimpleLanding() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          SafetySync.AI
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/login" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', border: '1px solid white', borderRadius: '4px' }}>
            Login
          </a>
          <button style={{
            background: 'white',
            color: '#2563eb',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          OSHA Compliance, Automated for Every Role
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          opacity: 0.9
        }}>
          Whether you manage safety, support HR, or deliver training — SafetySync saves hours and keeps your business audit-ready.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button style={{
            background: 'white',
            color: '#2563eb',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            Book a Demo
          </button>
          <button style={{
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        background: 'white',
        color: '#333',
        padding: '4rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2563eb'
          }}>
            Why Choose SafetySync?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>AI-Powered Processing</h3>
              <p>Extract, verify, and align training records with OSHA standards instantly using advanced AI technology.</p>
            </div>
            <div style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>Live Training Matrix</h3>
              <p>Auto-update training records, show progress by department, and stay inspection-ready at all times.</p>
            </div>
            <div style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>Digital Certificates</h3>
              <p>Generate QR-verifiable certificates and digital ID cards for every employee automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section style={{
        background: '#f8fafc',
        color: '#333',
        padding: '4rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2563eb'
          }}>
            Built for Every Safety Role
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { title: "EHS Managers", desc: "Streamline compliance tracking and reporting" },
              { title: "HR Teams", desc: "Automate employee training requirements" },
              { title: "Safety Instructors", desc: "Manage certifications and student records" },
              { title: "Training Centers", desc: "Scale operations with automated workflows" }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#2563eb',
                color: 'white',
                padding: '2rem',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
              >
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{item.title}</h3>
                <p style={{ opacity: 0.9 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem'
        }}>
          Ready to Transform Your Safety Program?
        </h2>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Join hundreds of companies using SafetySync to stay compliant and audit-ready.
        </p>
        <button style={{
          background: 'white',
          color: '#2563eb',
          border: 'none',
          padding: '1rem 3rem',
          borderRadius: '8px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Start Your Free Trial Today
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1e3a8a',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <p>© 2025 SafetySync.AI. All rights reserved.</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/privacy" style={{ color: 'white', marginRight: '2rem' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: 'white', marginRight: '2rem' }}>Terms of Service</a>
          <a href="/contact" style={{ color: 'white' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}