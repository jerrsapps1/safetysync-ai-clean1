import { useState, useEffect } from 'react';
import PricingFAQ from '@/components/PricingFAQ';
import ComparisonModal from '@/components/ComparisonModal';
import { clarity } from '@/lib/clarity-analytics';

export default function LandingPageSimple() {
  const [showModal, setShowModal] = useState(false);
  const [liferCount, setLiferCount] = useState(0);

  useEffect(() => {
    async function fetchLiferCount() {
      try {
        const res = await fetch('/api/lifers-claimed');
        const data = await res.json();
        setLiferCount(data.count);
      } catch (err) {
        console.error('Failed to load lifer count', err);
      }
    }
    fetchLiferCount();
  }, []);

  return (
    <div className="bg-gray-50">
      <header className="text-center py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Simplify Your OSHA Compliance</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Smart tracking for training, certification, and audit readiness.</p>
        <div className="mt-6">
          <button
            onClick={() => {
              if (window.clarity) {
                window.clarity('set', 'comparison_modal_opened', true);
              }
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition duration-200"
          >
            See Competitor Comparison
          </button>
        </div>
      </header>

      <section className="text-center bg-white py-6">
        <div className="text-xl font-semibold text-gray-800">
          🎉 {liferCount}+ companies joined the Lifer Plan
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Pricing FAQs</h2>
          <PricingFAQ />
        </div>
      </section>

      {showModal && (
        <ComparisonModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}