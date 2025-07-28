import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface InvoiceItem {
  amount: number;
  description: string;
}

export default function InvoiceManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    email: '',
    poNumber: '',
    items: [{ amount: 0, description: '' }] as InvoiceItem[]
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { amount: 0, description: '' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.email || formData.items.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add at least one item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Convert amounts to cents for Stripe
      const processedItems = formData.items.map(item => ({
        ...item,
        amount: Math.round(item.amount * 100)
      }));

      const response = await apiRequest('POST', '/api/invoice/create-invoice', {
        customerId: formData.customerId,
        email: formData.email,
        poNumber: formData.poNumber,
        items: processedItems
      });

      toast({
        title: "Invoice Created",
        description: "Invoice has been created and sent to the customer successfully!",
      });

      // Reset form
      setFormData({
        customerId: '',
        email: '',
        poNumber: '',
        items: [{ amount: 0, description: '' }]
      });

      console.log('Invoice created:', response);
    } catch (error: any) {
      console.error('Invoice creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Invoice Management</h1>
          <p className="text-blue-100">Create and send invoices with Stripe integration</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerId" className="text-white">Stripe Customer ID *</Label>
                  <Input
                    id="customerId"
                    value={formData.customerId}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                    placeholder="cus_xxxxxxxxxx"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Customer Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="customer@company.com"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="poNumber" className="text-white">PO Number (Optional)</Label>
                <Input
                  id="poNumber"
                  value={formData.poNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
                  placeholder="PO-2025-001"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-white text-lg">Invoice Items *</Label>
                  <Button
                    type="button"
                    onClick={addItem}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Add Item
                  </Button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="md:col-span-2">
                      <Label className="text-white">Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Safety compliance consulting"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Amount ($)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.amount || ''}
                          onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                          required
                        />
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="text-right">
                <div className="text-white text-xl font-semibold">
                  Total: ${totalAmount.toFixed(2)}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  {loading ? 'Creating Invoice...' : 'Create & Send Invoice'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <h3 className="text-white font-semibold mb-2">How it works:</h3>
            <ul className="text-blue-100 space-y-1">
              <li>• Enter the customer's Stripe Customer ID (must be created in Stripe first)</li>
              <li>• Add invoice items with descriptions and amounts</li>
              <li>• Invoice will be created in Stripe with 30-day payment terms</li>
              <li>• Customer will receive an email with payment link</li>
              <li>• Automatic tax calculation is enabled</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}