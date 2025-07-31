// File: src/components/Sidebar.tsx

import React from "react";
import { Link, useLocation } from "wouter";
import { BarChart3, Users, FileText, Settings, ClipboardList, Upload, Image } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/workspace", icon: BarChart3, label: "Dashboard" },
    { href: "/workspace/employees", icon: Users, label: "Employees" },
    { href: "/workspace/upload-training", icon: Upload, label: "Upload Training" },
    { href: "/workspace/instructor-backgrounds", icon: Image, label: "Instructor Backgrounds" },
    { href: "/workspace/certificates", icon: ClipboardList, label: "Certificates" },
    { href: "/workspace/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-8">
        <img src="/logo.png" alt="SafetySync.AI" className="h-8 w-auto" />
        <span className="text-xl font-semibold">SafetySync.AI</span>
      </div>
      
      <nav className="space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <a 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                location === href 
                  ? "bg-blue-700 text-white" 
                  : "hover:bg-blue-700/50 text-blue-100 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-blue-700">
        <div className="text-sm text-blue-200">
          <p>Workspace</p>
          <p className="text-xs text-blue-300 mt-1">SafetySync.AI Platform</p>
        </div>
      </div>
    </aside>
  );
}