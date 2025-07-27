import React from 'react';

export default function PricingFAQ() {
  return (
    <div className="space-y-4 text-gray-800">
      <div>
        <h4 className="font-semibold">What's included in each plan?</h4>
        <p>All plans include access to the admin dashboard, training record tools, and compliance automation features. Higher tiers unlock bulk actions, integrations, and customization.</p>
      </div>
      <div>
        <h4 className="font-semibold">Do you offer monthly billing?</h4>
        <p>Yes! You can switch between monthly and annual billing anytime.</p>
      </div>
      <div>
        <h4 className="font-semibold">What is the Lifer Plan?</h4>
        <p>The Lifer Plan is our lifetime access offer. Pay once, get access forever—with all updates and premium features.</p>
      </div>
    </div>
  );
}