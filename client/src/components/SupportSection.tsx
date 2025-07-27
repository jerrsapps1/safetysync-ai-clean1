import React from 'react';

export default function SupportSection() {
  return (
    <section className="bg-white py-12 px-6 rounded-xl shadow max-w-5xl mx-auto mt-10">
      <div className="text-center">
        <div className="text-blue-700 text-4xl mb-2">💬</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-8">
          Our support team is here to help with anything related to SafetySync.ai or OSHA compliance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Chat */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-blue-600 text-3xl mb-2">💬</div>
            <h4 className="font-semibold text-gray-800 mb-1">Live Chat</h4>
            <p className="text-gray-600 text-sm mb-4">Available 24/7</p>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow">
              Start Chat
            </button>
          </div>

          {/* Email Support */}
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-green-600 text-3xl mb-2">📧</div>
            <h4 className="font-semibold text-gray-800 mb-1">Email Support</h4>
            <p className="text-gray-600 text-sm mb-4">Response within 2 hours</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
              Send Email
            </button>
          </div>

          {/* Premium Support */}
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-purple-600 text-3xl mb-2">💎</div>
            <h4 className="font-semibold text-gray-800 mb-1">Premium Support</h4>
            <p className="text-gray-600 text-sm mb-4">For paying customers</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}