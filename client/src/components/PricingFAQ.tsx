import React from 'react';

export default function PricingFAQ() {
  return (
    <div className="space-y-4 text-gray-800">
      <div className="rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-800">What's included in each plan?</h4>
        <p className="text-gray-700">All plans include access to the admin dashboard, training record tools, and compliance automation features. Higher tiers unlock bulk actions, integrations, and customization.</p>
      </div>
      <div className="rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-800">Do you offer monthly billing?</h4>
        <p className="text-gray-700">Yes! You can switch between monthly and annual billing anytime.</p>
      </div>
      <div className="rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-800">What is the Lifer Plan?</h4>
        <p className="text-gray-700">The Lifer Plan is our lifetime access offer. Pay once, get access forever—with all updates and premium features.</p>
      </div>
    </div>
  );
}