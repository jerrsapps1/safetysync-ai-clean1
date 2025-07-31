// File: src/components/sidebar-test.jsx

import React from "react";

export default function SidebarTest() {
  return (
    <div style={{ 
      width: "250px", 
      backgroundColor: "#1e40af", 
      color: "white", 
      padding: "20px",
      minHeight: "100vh"
    }}>
      <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Workspace Test</h2>
      <nav>
        <div style={{ marginBottom: "10px" }}>
          <a href="/workspace" style={{ color: "white", textDecoration: "underline" }}>Dashboard</a>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <a href="/workspace/employees" style={{ color: "white", textDecoration: "underline" }}>Employees</a>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <a href="/workspace/training" style={{ color: "white", textDecoration: "underline" }}>Training</a>
        </div>
      </nav>
    </div>
  );
}