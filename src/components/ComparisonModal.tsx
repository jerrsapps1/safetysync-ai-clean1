import React from 'react';

interface ComparisonModalProps {
  onClose: () => void;
}

export default function ComparisonModal({ onClose }: ComparisonModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">How We Compare</h2>
        <p className="text-gray-700 mb-4">Here's how SafetySync.ai stacks up against other EHS & compliance platforms:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>✓ Lifetime pricing vs. monthly subscriptions</li>
          <li>✓ Smart tracking without complex learning curves</li>
          <li>✓ Fast setup — no consultants required</li>
          <li>✓ Designed for safety, HR, and compliance teams</li>
        </ul>
      </div>
    </div>
  );
}