// File: src/layouts/WorkspaceLayout.tsx

import React from "react";
// @ts-ignore
import Sidebar from "../components/Sidebar.tsx";
// @ts-ignore
import WorkspaceView from "../pages/workspace-view.jsx";

export default function WorkspaceLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: "1", backgroundColor: "#f3f4f6", padding: "20px" }}>
        <WorkspaceView />
      </div>
    </div>
  );
}