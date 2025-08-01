// File: src/pages/employee-profile.jsx

import React from "react";
import { useParams } from "wouter";

// Mock employee training data
const mockEmployee = {
  id: "e123",
  name: "Gerardo Hernandez",
  department: "Operations",
  qrCode: "/qr/e123.png",
  trainings: [
    {
      course: "Fall Protection",
      date: "2025-07-30",
      certUrl: "/certs/e123-fall-protection.pdf",
      cardUrl: "/cards/e123-fall-protection.png",
      standard: "1926.503",
    },
    {
      course: "Forklift Operation",
      date: "2025-06-12",
      certUrl: "/certs/e123-forklift.pdf",
      cardUrl: "/cards/e123-forklift.png",
      standard: "1910.178",
    },
  ],
};

export default function EmployeeProfile() {
  const { id } = useParams();
  const employee = mockEmployee; // TODO: Fetch real data by ID

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          {employee.name}'s Profile
        </h1>

        <div className="flex items-center space-x-4 mb-6">
          <img
            src={employee.qrCode}
            alt="QR Code"
            className="w-28 h-28 border rounded-lg"
          />
          <div>
            <p className="text-gray-700">Department: {employee.department}</p>
            <p className="text-gray-500 text-sm">Employee ID: {employee.id}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Training History
          </h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Course</th>
                <th>Date</th>
                <th>Standard</th>
                <th>Certificate</th>
                <th>Wallet Card</th>
              </tr>
            </thead>
            <tbody>
              {employee.trainings.map((t, i) => (
                <tr key={i} className="border-t text-gray-700">
                  <td className="py-2">{t.course}</td>
                  <td>{t.date}</td>
                  <td>{t.standard}</td>
                  <td>
                    <a href={t.certUrl} className="text-blue-600 hover:underline" target="_blank">
                      View Cert
                    </a>
                  </td>
                  <td>
                    <a href={t.cardUrl} className="text-blue-600 hover:underline" target="_blank">
                      View Card
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}