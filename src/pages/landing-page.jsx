// File: src/pages/landing-page.jsx

import React from "react";

export default function LandingPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {/* Header */}
      <header style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="SafetySync.AI" style={{ height: "40px", width: "auto", marginRight: "12px" }} />
          <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>SafetySync.AI</span>
        </div>
        <nav>
          <a href="/workspace" style={{ 
            color: "white", 
            textDecoration: "none", 
            padding: "8px 16px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "6px"
          }}>
            Access Workspace
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        <h1 style={{ 
          fontSize: "48px", 
          fontWeight: "bold", 
          color: "white", 
          marginBottom: "24px",
          lineHeight: "1.2"
        }}>
          AI-Powered OSHA Compliance Made Simple
        </h1>
        <p style={{ 
          fontSize: "20px", 
          color: "rgba(255,255,255,0.9)", 
          marginBottom: "32px",
          lineHeight: "1.6"
        }}>
          Streamline safety management with intelligent document processing, automated compliance tracking, and audit-ready reporting for your workforce.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/workspace" style={{
            backgroundColor: "white",
            color: "#1e40af",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px"
          }}>
            Get Started
          </a>
          <a href="#features" style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
            border: "1px solid rgba(255,255,255,0.3)"
          }}>
            Learn More
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ 
        marginTop: "80px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        maxWidth: "1200px",
        width: "100%"
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "24px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
            AI Document Processing
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}>
            Automatically extract and analyze training records, certificates, and compliance documents with 98.7% accuracy.
          </p>
        </div>
        
        <div style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "24px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
            Digital Credentials
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}>
            Generate professional certificates and mobile wallet cards for employee verification and compliance tracking.
          </p>
        </div>
        
        <div style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "24px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
            Compliance Dashboard
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}>
            Monitor workforce compliance status, track expiring certifications, and generate audit-ready reports instantly.
          </p>
        </div>
      </div>
    </div>
  );
}