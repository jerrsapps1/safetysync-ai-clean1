// File: src/components/Sidebar.tsx

import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Workspace</h2>
      <nav>
        <a href="/workspace" className="block mb-2 hover:underline">Dashboard</a>
        <a href="/workspace/employee-management" className="block mb-2 hover:underline">Employees</a>
        <a href="/workspace/upload-training" className="block mb-2 hover:underline">Upload Training</a>
        <a href="/workspace/instructor-backgrounds" className="block mb-2 hover:underline">Instructor Backgrounds</a>
        <a href="/workspace/certificates" className="block mb-2 hover:underline">Certificates</a>
        <a href="/workspace/settings" className="block mb-2 hover:underline">Settings</a>
      </nav>
    </div>
  );
}