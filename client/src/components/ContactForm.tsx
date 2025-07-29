import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    company: '', 
    role: '', 
    message: '',
    demoRequest: false,
    heardFrom: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('✅ Thanks! We\'ll be in touch.');
        setFormData({ name: '', email: '', company: '', role: '', message: '', demoRequest: false, heardFrom: '' });
      } else {
        setStatus('❌ Something went wrong. Try again.');
      }
    } catch (error) {
      setStatus('❌ Something went wrong. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Contact Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          name="name" 
          placeholder="Your Name" 
          onChange={handleChange} 
          value={formData.name} 
          required 
          className="col-span-1 w-full p-2 border rounded" 
        />
        <input 
          name="email" 
          placeholder="Your Email" 
          onChange={handleChange} 
          value={formData.email} 
          required 
          className="col-span-1 w-full p-2 border rounded" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          name="company" 
          placeholder="Company (optional)" 
          onChange={handleChange} 
          value={formData.company} 
          className="col-span-1 w-full p-2 border rounded" 
        />
        <input 
          name="role" 
          placeholder="Your Role (optional)" 
          onChange={handleChange} 
          value={formData.role} 
          className="col-span-1 w-full p-2 border rounded" 
        />
      </div>

      <textarea 
        name="message" 
        placeholder="Your Message" 
        onChange={handleChange} 
        value={formData.message} 
        required 
        className="w-full p-2 border rounded" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="demoRequest"
              checked={formData.demoRequest}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Request a demo</span>
          </label>
        </div>
        <div className="col-span-1">
          <select
            name="heardFrom"
            value={formData.heardFrom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">How did you hear about us?</option>
            <option value="google">Google Search</option>
            <option value="social">Social Media</option>
            <option value="referral">Referral</option>
            <option value="industry">Industry Event</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
      <p className="text-sm text-gray-600">{status}</p>
    </form>
  );
}