// File: src/pages/instructor-backgrounds.jsx

import React from "react";

export default function InstructorBackgrounds() {
  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1e40af", marginBottom: "16px" }}>
        Instructor Backgrounds
      </h1>
      <p style={{ color: "#374151", fontSize: "16px", marginBottom: "20px" }}>
        Customize certificate and wallet card backgrounds for your training programs.
      </p>
      {/* Upload New Background */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#374151" }}>
          Upload Custom Background
        </h3>
        
        <div style={{
          border: "2px dashed #d1d5db",
          borderRadius: "8px",
          padding: "30px",
          textAlign: "center",
          backgroundColor: "#f9fafb"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎨</div>
          <p style={{ color: "#6b7280", marginBottom: "12px" }}>
            Upload your custom certificate background
          </p>
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
            Choose File
          </button>
        </div>
      </div>

      {/* Background Templates */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#374151" }}>
          Available Templates
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {/* Template 1 */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{
              height: "120px",
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Professional Blue
            </div>
            <div style={{ padding: "12px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
                Corporate Template
              </h4>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                Clean professional design
              </p>
              <button style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "12px",
                cursor: "pointer",
                width: "100%"
              }}>
                Use Template
              </button>
            </div>
          </div>

          {/* Template 2 */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{
              height: "120px",
              background: "linear-gradient(135deg, #059669, #10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Safety Green
            </div>
            <div style={{ padding: "12px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
                Safety Focused
              </h4>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                High-visibility design
              </p>
              <button style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "12px",
                cursor: "pointer",
                width: "100%"
              }}>
                Use Template
              </button>
            </div>
          </div>

          {/* Template 3 */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{
              height: "120px",
              background: "linear-gradient(135deg, #dc2626, #ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Emergency Red
            </div>
            <div style={{ padding: "12px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
                Emergency Response
              </h4>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                Critical training emphasis
              </p>
              <button style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "12px",
                cursor: "pointer",
                width: "100%"
              }}>
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}