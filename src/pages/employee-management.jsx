// File: src/pages/employee-management.jsx

import React from "react";

export default function EmployeeManagement() {
  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1e40af", marginBottom: "16px" }}>
        Employee Management
      </h1>
      <p style={{ color: "#374151", fontSize: "16px", marginBottom: "20px" }}>
        Manage your workforce, track certifications, and monitor compliance status.
      </p>
      {/* Add Employee Button */}
      <button style={{
        backgroundColor: "#1e40af",
        color: "white",
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "20px",
        cursor: "pointer"
      }}>
        + Add New Employee
      </button>

      {/* Employee Table */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "8px", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Department</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Certifications</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px", color: "#374151" }}>John Smith</td>
              <td style={{ padding: "12px", color: "#374151" }}>Construction</td>
              <td style={{ padding: "12px", color: "#374151" }}>3</td>
              <td style={{ padding: "12px" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: "#dcfce7",
                  color: "#166534"
                }}>
                  Compliant
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px", marginRight: "12px" }}>View</button>
                <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>Edit</button>
              </td>
            </tr>
            <tr style={{ borderTop: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px", color: "#374151" }}>Sarah Johnson</td>
              <td style={{ padding: "12px", color: "#374151" }}>Safety</td>
              <td style={{ padding: "12px", color: "#374151" }}>5</td>
              <td style={{ padding: "12px" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: "#dcfce7",
                  color: "#166534"
                }}>
                  Compliant
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px", marginRight: "12px" }}>View</button>
                <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>Edit</button>
              </td>
            </tr>
            <tr style={{ borderTop: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px", color: "#374151" }}>Mike Wilson</td>
              <td style={{ padding: "12px", color: "#374151" }}>Operations</td>
              <td style={{ padding: "12px", color: "#374151" }}>2</td>
              <td style={{ padding: "12px" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: "#fef3c7",
                  color: "#92400e"
                }}>
                  Expiring Soon
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px", marginRight: "12px" }}>View</button>
                <button style={{ color: "#1e40af", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}