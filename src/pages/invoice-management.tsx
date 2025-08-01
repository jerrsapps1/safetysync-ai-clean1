import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvoiceForm from '@/components/InvoiceForm';

export default function InvoiceManagement() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Invoice Management</h1>
          <p className="text-blue-100">Create and send invoices with Stripe integration</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceForm />
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <h3 className="text-white font-semibold mb-2">How it works:</h3>
            <ul className="text-blue-100 space-y-1">
              <li>• Enter the customer's Stripe Customer ID (must be created in Stripe first)</li>
              <li>• Add invoice amount and description</li>
              <li>• Invoice will be created in Stripe with 30-day payment terms</li>
              <li>• Customer will receive an email with payment link and W-9 form</li>
              <li>• Automatic tax calculation is enabled</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}