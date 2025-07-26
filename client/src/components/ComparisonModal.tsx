import React from 'react';

const competitors = [
  { name: 'SafetySync.ai', cost: 'Starts at $49/mo', trainingIncluded: 'No', recordkeeping: 'Yes', 'AI-powered': 'Yes' },
  { name: 'KPA', cost: 'Est. $2,500+/yr', trainingIncluded: 'Yes', recordkeeping: 'Yes', 'AI-powered': 'No' },
  { name: 'EHS Insight', cost: 'Est. $3,000+/yr', trainingIncluded: 'Yes', recordkeeping: 'Yes', 'AI-powered': 'No' },
  { name: 'HSI', cost: 'Custom pricing', trainingIncluded: 'Yes', recordkeeping: 'Limited', 'AI-powered': 'No' },
];

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full rounded shadow-lg p-6 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Compare SafetySync.ai to Other EHS Platforms</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Platform</th>
              <th className="p-2 text-left">Estimated Cost</th>
              <th className="p-2 text-left">Training Included</th>
              <th className="p-2 text-left">Recordkeeping</th>
              <th className="p-2 text-left">AI Features</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 font-medium text-gray-800">{c.name}</td>
                <td className="p-2">{c.cost}</td>
                <td className="p-2">{c.trainingIncluded}</td>
                <td className="p-2">{c.recordkeeping}</td>
                <td className="p-2">{c['AI-powered']}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
}