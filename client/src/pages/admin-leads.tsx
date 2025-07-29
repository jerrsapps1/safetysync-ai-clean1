import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const credentials = btoa('admin:secretpassword123'); // Base64 encode credentials
    fetch('/api/leads', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    })
      .then(res => res.json())
      .then(data => setLeads(data))
      .catch(err => console.error('Error fetching leads:', err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">📋 Lead Submissions</h1>
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