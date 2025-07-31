// File: src/pages/employee-management.jsx

import React from "react";

export default function EmployeeManagement() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Management</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">
            This section will allow you to view, edit, and manage all employees in your
            organization. Search, filter, and assign roles like Instructor.
          </p>
          <div className="mt-4 text-center text-sm text-gray-400">
            ⏳ Feature table and tools coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}