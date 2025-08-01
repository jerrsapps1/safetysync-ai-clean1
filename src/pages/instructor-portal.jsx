// File: src/pages/instructor-portal.jsx

import React from "react";

export default function InstructorPortal() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Instructor Portal
        </h1>
        <p className="text-gray-600 text-center">
          This page will help instructors manage classes, upload documents,
          and track employee training progress.
        </p>
        <div className="mt-8 text-center text-sm text-gray-400">
          ⏳ Feature dashboard coming soon.
        </div>
      </div>
    </div>
  );
}