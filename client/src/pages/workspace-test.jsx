// File: src/pages/workspace-test.jsx

import React from "react";

export default function WorkspaceTest() {
  return (
    <div style={{ padding: "20px", backgroundColor: "lightblue", minHeight: "100vh" }}>
      <h1 style={{ color: "black", fontSize: "24px" }}>Workspace Test Page</h1>
      <p style={{ color: "black" }}>If you can see this, the workspace routing is working!</p>
      <div style={{ backgroundColor: "white", padding: "10px", margin: "10px 0", border: "1px solid black" }}>
        <h2>Test Box</h2>
        <p>This is a test to verify the workspace layout is rendering properly.</p>
      </div>
    </div>
  );
}