// File: src/layouts/WorkspaceLayout.tsx

import React from "react";
// @ts-ignore
import Sidebar from "../components/Sidebar.tsx";
// @ts-ignore
import WorkspaceView from "../pages/workspace-view.jsx"; // or use <Outlet /> if using React Router

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <WorkspaceView />
      </main>
    </div>
  );
}