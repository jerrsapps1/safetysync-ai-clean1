import React, { useState } from 'react';

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    description: '',
    poNumber: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const items = [{
      amount: parseInt(formData.amount) * 100,
      description: formData.description,
    }];

    const res = await fetch('/api/invoice/create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: formData.customerId,
        items,
        poNumber: formData.poNumber,
        email: formData.email,
      }),
    });

    const data = await res.json();
    setMessage(res.ok ? "Invoice sent!" : `Error: ${data.error}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        name="customerId" 
        onChange={handleChange} 
        placeholder="Customer ID" 
        required 
        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input 
        name="email" 
        type="email" 
        onChange={handleChange} 
        placeholder="Customer Email" 
        required 
        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input 
        name="amount" 
        type="number" 
        onChange={handleChange} 
        placeholder="Amount (USD)" 
        required 
        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input 
        name="description" 
        onChange={handleChange} 
        placeholder="Description" 
        required 
        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input 
        name="poNumber" 
        onChange={handleChange} 
        placeholder="PO Number (optional)" 
        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Send Invoice
      </button>
      {message && (
        <p className={`text-center font-medium ${message.includes('Error') ? 'text-red-300' : 'text-green-300'}`}>
          {message}
        </p>
      )}
    </form>
  );
}