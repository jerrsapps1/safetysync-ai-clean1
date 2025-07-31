// File: src/pages/workspace-view.jsx

import React from "react";
import { BarChart3, Users, FileText } from "lucide-react";

export default function WorkspaceView() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-3">
          <a href="#" className="flex items-center space-x-2 hover:text-emerald-400">
            <Users className="w-5 h-5" /> <span>Employees</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-emerald-400">
            <FileText className="w-5 h-5" /> <span>Documents</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-emerald-400">
            <BarChart3 className="w-5 h-5" /> <span>Analytics</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to SafetySync.AI</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold">Employees</h2>
            <p className="text-gray-500">214 Active Employees</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold">Certificates Issued</h2>
            <p className="text-gray-500">547 Certificates</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold">Compliance Score</h2>
            <p className="text-gray-500">92.4%</p>
          </div>
        </div>
      </main>
    </div>
  );
}