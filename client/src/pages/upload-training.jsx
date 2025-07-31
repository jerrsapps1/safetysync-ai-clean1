// File: src/pages/upload-training.jsx

import React from "react";

export default function UploadTraining() {
  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1e40af", marginBottom: "16px" }}>
        Upload Training Records
      </h1>
      <p style={{ color: "#374151", fontSize: "16px", marginBottom: "20px" }}>
        Upload and process training documents with AI-powered analysis.
      </p>
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Document Upload</h2>
        
        {/* Upload Area */}
        <div style={{
          border: "2px dashed #d1d5db",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px",
          backgroundColor: "#f9fafb"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>
            Upload Training Documents
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>
            Drag and drop files here, or click to browse
          </p>
          <button style={{
            backgroundColor: "#1e40af",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Select Files
          </button>
        </div>

        {/* Supported Formats */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>
            Supported Formats
          </h4>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["PDF", "DOC", "DOCX", "JPG", "PNG"].map(format => (
              <span key={format} style={{
                backgroundColor: "#e5e7eb",
                color: "#374151",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                {format}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>
            Recent Uploads
          </h4>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px" }}>
            <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: "600", color: "#374151" }}>Fall Protection Training.pdf</span>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Uploaded 2 hours ago</div>
              </div>
              <span style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                Processed
              </span>
            </div>
            <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: "600", color: "#374151" }}>OSHA 30 Certificate.jpg</span>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Uploaded 1 day ago</div>
              </div>
              <span style={{
                backgroundColor: "#fef3c7",
                color: "#92400e",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}