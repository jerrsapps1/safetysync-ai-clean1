import React, { useState } from "react";
import { Button } from "../components/ui/button";

const initialState = {
  name: "",
  email: "",
  company: "",
  role: "",
  topic: "General",
  urgency: "Normal",
  message: "",
  agree: false,
};

export default function SupportPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<{ loading: boolean; ok: boolean | null; msg: string }>({ loading: false, ok: null, msg: "" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !form.agree) {
      setStatus({ loading: false, ok: false, msg: "Please complete required fields." });
      return;
    }
    try {
      setStatus({ loading: true, ok: null, msg: "" });
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setForm(initialState);
      setStatus({ loading: false, ok: true, msg: "Thanks! Your request has been submitted." });
    } catch (err) {
      setStatus({ loading: false, ok: false, msg: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support & Helpdesk</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Questions, issues, or feature requests? Send us a message and we'll get back within 24 hours.
        </p>
      </section>

      {/* Form */}
      <section className="py-16 px-6">
        <form onSubmit={submit} className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow border space-y-5">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name *</label>
              <input
                className="mt-1 w-full border rounded-lg p-3"
                name="name" value={form.name} onChange={update} placeholder="Your full name" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email *</label>
              <input
                className="mt-1 w-full border rounded-lg p-3"
                type="email" name="email" value={form.email} onChange={update} placeholder="you@company.com" required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Company</label>
              <input
                className="mt-1 w-full border rounded-lg p-3"
                name="company" value={form.company} onChange={update} placeholder="Company Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Role/Title</label>
              <input
                className="mt-1 w-full border rounded-lg p-3"
                name="role" value={form.role} onChange={update} placeholder="Safety Manager"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Topic</label>
              <select className="mt-1 w-full border rounded-lg p-3" name="topic" value={form.topic} onChange={update}>
                <option>General</option>
                <option>Billing</option>
                <option>Technical</option>
                <option>Account</option>
                <option>Integrations</option>
                <option>Security</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Urgency</label>
              <select className="mt-1 w-full border rounded-lg p-3" name="urgency" value={form.urgency} onChange={update}>
                <option>Normal</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium">Message *</label>
            <textarea
              className="mt-1 w-full border rounded-lg p-3 h-32"
              name="message" value={form.message} onChange={update} placeholder="How can we help?" required
            />
          </div>

          {/* Agree */}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="agree" checked={form.agree} onChange={update} />
            I agree to be contacted about this request. *
          </label>

          {/* Status */}
          {status.msg && (
            <div className={`text-sm ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.msg}</div>
          )}

          <div className="flex justify-end">
            <Button type="submit" className="px-6 py-3" disabled={status.loading}>
              {status.loading ? "Sending..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}