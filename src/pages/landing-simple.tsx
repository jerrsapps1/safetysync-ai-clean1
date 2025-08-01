import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingSimple() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '5rem 1.5rem',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3rem)',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          OSHA Compliance, Automated for Every Role
        </h1>
        <p style={{
          fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
          maxWidth: '32rem',
          margin: '0 auto 2rem auto'
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
            color: '#1e40af',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}>
            Book a Demo
          </button>
          <button style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            Get Started Free
          </button>
        </div>
      </section>

      {/* Persona Grid */}
      <section style={{
        background: 'white',
        color: '#111827',
        padding: '4rem 1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          Who is SafetySync For?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          maxWidth: '72rem',
          margin: '0 auto'
        }}>
          {[
            { title: "EHS Managers", href: "/ehs" },
            { title: "HR Teams", href: "/hr" },
            { title: "Instructors", href: "/instructors" },
            { title: "Training Centers", href: "/centers" }
          ].map((item, i) => (
            <a key={i} href={item.href} style={{
              background: '#dbeafe',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center',
              fontWeight: '600',
              textDecoration: 'none',
              color: '#111827',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#bfdbfe'}
            onMouseOut={(e) => e.target.style.background = '#dbeafe'}
            >
              {item.title}
              <span style={{ marginLeft: '0.5rem' }}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{
        padding: '4rem 1.5rem',
        maxWidth: '72rem',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'white'
        }}>
          Why SafetySync?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          textAlign: 'left'
        }}>
          {[
            {
              title: "AI-Powered Document Processing",
              desc: "Extract, verify, and align training records with OSHA standards — instantly.",
            },
            {
              title: "Live Training Matrix",
              desc: "Auto-update training records, show progress by department, and stay inspection-ready.",
            },
            {
              title: "Certificate & Wallet Card Generator",
              desc: "Generate QR-verifiable certificates and digital ID cards for every employee.",
            },
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section style={{
        background: '#1d4ed8',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <blockquote style={{
          fontSize: '1.25rem',
          fontStyle: 'italic',
          maxWidth: '32rem',
          margin: '0 auto',
          color: 'white'
        }}>
          "I've worked in safety for 15 years — this is the tool we've needed all along. SafetySync handles the compliance chaos."
        </blockquote>
        <p style={{
          marginTop: '1rem',
          fontWeight: '600'
        }}>
          — Gerardo H., Safety Director
        </p>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        background: 'white',
        color: '#1e40af'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Ready to Simplify Compliance?
        </h2>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          maxWidth: '36rem',
          margin: '0 auto 2rem auto'
        }}>
          Try SafetySync free or book a personalized walkthrough with our team.
        </p>
        <button style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          fontSize: '1.125rem',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer'
        }}>
          Start My Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1e3a8a',
        color: 'white',
        padding: '2rem 1.5rem',
        fontSize: '0.875rem',
        textAlign: 'center'
      }}>
        © {new Date().getFullYear()} SafetySync.AI · All rights reserved ·
        <a href="/privacy" style={{
          textDecoration: 'underline',
          marginLeft: '0.5rem',
          color: 'white'
        }}>
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}