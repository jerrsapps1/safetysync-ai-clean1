// File: src/layouts/WorkspaceLayout.tsx

import React from "react";
// @ts-ignore
import SidebarTest from "../components/sidebar-test.jsx";
// @ts-ignore
import WorkspaceTest from "../pages/workspace-test.jsx";

export default function WorkspaceLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarTest />
      <div style={{ flex: "1", backgroundColor: "#f3f4f6", padding: "20px" }}>
        <WorkspaceTest />
      </div>
    </div>
  );
}