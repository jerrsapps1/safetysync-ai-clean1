// File: src/pages/workspace-settings.jsx

import React from "react";

export default function WorkspaceSettings() {
  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1e40af", marginBottom: "16px" }}>
        Workspace Settings
      </h1>
      <p style={{ color: "#374151", fontSize: "16px", marginBottom: "20px" }}>
        Configure your workspace preferences and system settings.
      </p>
      {/* Organization Settings */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#374151" }}>
          Organization Information
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
              Company Name
            </label>
            <input 
              type="text" 
              defaultValue="Acme Construction LLC"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
              Industry Type
            </label>
            <select style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}>
              <option>Construction</option>
              <option>Manufacturing</option>
              <option>Healthcare</option>
              <option>Transportation</option>
            </select>
          </div>
        </div>
        
        <button style={{
          backgroundColor: "#1e40af",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Save Changes
        </button>
      </div>

      {/* Compliance Settings */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#374151" }}>
          Compliance Configuration
        </h3>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#374151" }}>
            <input type="checkbox" defaultChecked style={{ marginRight: "8px" }} />
            Enable automatic expiry notifications (30 days before)
          </label>
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#374151" }}>
            <input type="checkbox" defaultChecked style={{ marginRight: "8px" }} />
            Require digital signatures on certificates
          </label>
        </div>
        
        <button style={{
          backgroundColor: "#1e40af",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Update Settings
        </button>
      </div>
    </div>
  );
}