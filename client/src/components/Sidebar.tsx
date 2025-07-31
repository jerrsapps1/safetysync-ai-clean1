// File: src/components/Sidebar.tsx

import React from "react";

export default function Sidebar() {
  return (
    <div style={{ 
      width: "250px", 
      backgroundColor: "#1e40af", 
      color: "white", 
      padding: "16px",
      minHeight: "100vh"
    }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Workspace</h2>
      <nav>
        <a href="/workspace" style={{ 
          display: "block", 
          marginBottom: "8px", 
          color: "white", 
          textDecoration: "none" 
        }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
           onMouseOut={(e) => e.target.style.textDecoration = "none"}>
          Dashboard
        </a>
        <a href="/workspace/employee-management" style={{ 
          display: "block", 
          marginBottom: "8px", 
          color: "white", 
          textDecoration: "none" 
        }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
           onMouseOut={(e) => e.target.style.textDecoration = "none"}>
          Employees
        </a>
        <a href="/workspace/upload-training" style={{ 
          display: "block", 
          marginBottom: "8px", 
          color: "white", 
          textDecoration: "none" 
        }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
           onMouseOut={(e) => e.target.style.textDecoration = "none"}>
          Upload Training
        </a>
        <a href="/workspace/instructor-backgrounds" style={{ 
          display: "block", 
          marginBottom: "8px", 
          color: "white", 
          textDecoration: "none" 
        }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
           onMouseOut={(e) => e.target.style.textDecoration = "none"}>
          Instructor Backgrounds
        </a>
        <a href="/workspace/certificates" style={{ 
          display: "block", 
          marginBottom: "8px", 
          color: "white", 
          textDecoration: "none" 
        }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
           onMouseOut={(e) => e.target.style.textDecoration = "none"}>
          Certificates
        </a>
        <a href="/workspace/settings" style={{ 
          display: "block", 
          marginBottom: "8px", 
          color: "white", 
          textDecoration: "none" 
        }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
           onMouseOut={(e) => e.target.style.textDecoration = "none"}>
          Settings
        </a>
      </nav>
    </div>
  );
}