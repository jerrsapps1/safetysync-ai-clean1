// File: src/pages/certificates.jsx

import React from "react";

export default function Certificates() {
  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1e40af", marginBottom: "16px" }}>
        Certificates & Digital Cards
      </h1>
      <p style={{ color: "#374151", fontSize: "16px", marginBottom: "20px" }}>
        Generate and manage training certificates and digital wallet cards.
      </p>
      {/* Generation Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", color: "#1e40af" }}>
            📜 Training Certificates
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "16px", fontSize: "14px" }}>
            Generate professional OSHA compliance certificates
          </p>
          <button style={{
            backgroundColor: "#1e40af",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%"
          }}>
            Generate Certificate
          </button>
        </div>
        
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", color: "#1e40af" }}>
            💳 Digital Wallet Cards
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "16px", fontSize: "14px" }}>
            Create mobile-friendly verification cards
          </p>
          <button style={{
            backgroundColor: "#1e40af",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%"
          }}>
            Generate Wallet Card
          </button>
        </div>
      </div>

      {/* Recent Generations */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#374151" }}>
          Recent Generations
        </h3>
        
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px" }}>
          <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: "600", color: "#374151" }}>Fall Protection Certificate - John Smith</span>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Generated 1 hour ago</div>
            </div>
            <div>
              <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px", marginRight: "8px" }}>Download</button>
              <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>View</button>
            </div>
          </div>
          
          <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: "600", color: "#374151" }}>OSHA 30 Wallet Card - Sarah Johnson</span>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Generated 2 hours ago</div>
            </div>
            <div>
              <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px", marginRight: "8px" }}>Download</button>
              <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>View</button>
            </div>
          </div>
          
          <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: "600", color: "#374151" }}>HazCom Training Certificate - Mike Wilson</span>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Generated yesterday</div>
            </div>
            <div>
              <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px", marginRight: "8px" }}>Download</button>
              <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}