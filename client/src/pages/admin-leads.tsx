import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

type Lead = {
  id: number;
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  demo_request: boolean;
  heard_from: string;
  created_at: string;
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/leads', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 403) {
          window.location.href = '/admin/login';
          return [];
        }
        return res.json();
      })
      .then(data => setLeads(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLocation('/admin/login');
  };

  const exportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Company', 'Role', 'Heard From', 'Demo Request', 'Message', 'Date'],
      ...leads.map(l => [
        l.name, l.email, l.company, l.role, l.heard_from || '',
        l.demo_request ? 'Yes' : 'No',
        l.message, new Date(l.created_at).toLocaleString()
      ])
    ].map(row => row.map(item => `"${item}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">📋 Lead Submissions</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to CSV
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Company</th>
              <th className="p-3">Role</th>
              <th className="p-3">Demo</th>
              <th className="p-3">Heard From</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t text-sm text-gray-700">
                <td className="p-3">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.company}</td>
                <td className="p-3">{lead.role}</td>
                <td className="p-3">
                  {lead.demo_request ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Yes</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">No</span>
                  )}
                </td>
                <td className="p-3">{lead.heard_from || '-'}</td>
                <td className="p-3 max-w-xs truncate">{lead.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}