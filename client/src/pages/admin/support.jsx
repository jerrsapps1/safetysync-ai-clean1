// Replit-ready Admin Support Dashboard (React)
// File: src/pages/admin/support.jsx

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";

export default function AdminSupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ status: "", urgency: "", resolved: "" });
  const [noteUpdates, setNoteUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.urgency) params.append("urgency", filters.urgency);
      if (filters.resolved) params.append("resolved", filters.resolved);

      const res = await fetch(`/api/support/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError("Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const updateTicket = async (id, updates) => {
    try {
      await fetch(`/api/support/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });
      fetchTickets();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const exportCSV = () => {
    const url = `/api/support/export/csv`;
    window.open(url + `?token=${localStorage.getItem("token")}`, "_blank");
  };

  const handleNoteChange = (id, value) => {
    setNoteUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveNote = (id) => {
    updateTicket(id, { internalNotes: noteUpdates[id] });
  };

  const handleResolve = (id) => {
    updateTicket(id, { resolved: true, status: "Resolved" });
  };

  if (loading) return <p className="p-4">Loading tickets...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>

      {/* Filter controls */}
      <div className="mb-4 flex gap-4">
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          value={filters.status}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters((f) => ({ ...f, urgency: e.target.value }))}
          value={filters.urgency}
        >
          <option value="">All Urgencies</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters((f) => ({ ...f, resolved: e.target.value }))}
          value={filters.resolved}
        >
          <option value="">All</option>
          <option value="true">Resolved</option>
          <option value="false">Unresolved</option>
        </select>

        <Button onClick={exportCSV}>Export to CSV</Button>
      </div>

      <div className="space-y-6">
        {tickets.map((t) => (
          <div key={t.id} className="p-4 border rounded-xl shadow bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg font-semibold">{t.topic} ({t.urgency})</h2>
                <p className="text-sm text-gray-500">
                  {t.name} • {t.email} • {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
              {t.resolved ? (
                <span className="text-green-600 font-bold">Resolved</span>
              ) : (
                <Button size="sm" onClick={() => handleResolve(t.id)}>Mark Resolved</Button>
              )}
            </div>
            <p className="mb-2 whitespace-pre-wrap">{t.message}</p>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Internal Notes</label>
              <textarea
                rows={3}
                className="w-full border rounded p-2"
                value={noteUpdates[t.id] ?? t.internalNotes ?? ""}
                onChange={(e) => handleNoteChange(t.id, e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm" onClick={() => handleSaveNote(t.id)}>
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}