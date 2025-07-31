// File: src/pages/workspace-view.jsx

import React from "react";
import { BarChart3, Users, FileText, Settings, ClipboardList } from "lucide-react";
import { Link } from "wouter";

export default function WorkspaceView() {
  return (
    <div className="w-full">
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
    </div>
  );
}