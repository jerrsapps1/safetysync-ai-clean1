// File: src/components/Sidebar.tsx

import React from "react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/workspace", label: "Dashboard" },
    { path: "/workspace/employee-management", label: "Employees" },
    { path: "/workspace/upload-training", label: "Upload Training" },
    { path: "/workspace/instructor-backgrounds", label: "Instructor Backgrounds" },
    { path: "/workspace/certificates", label: "Certificates" },
    { path: "/workspace/settings", label: "Settings" }
  ];

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
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "white", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              backgroundColor: location === item.path ? "#1d4ed8" : "transparent"
            }} onMouseOver={(e) => {
              if (location !== item.path) {
                e.target.style.backgroundColor = "#2563eb";
              }
            }} onMouseOut={(e) => {
              if (location !== item.path) {
                e.target.style.backgroundColor = "transparent";
              }
            }}>
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}