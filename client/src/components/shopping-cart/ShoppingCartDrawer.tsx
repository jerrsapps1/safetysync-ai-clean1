import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  CreditCard,
  Award,
  IdCard,
  Percent
} from 'lucide-react';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCartDrawer({ isOpen, onClose }: ShoppingCartDrawerProps) {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getVolumeDiscount,
    getTotalDiscount,
    getFinalTotal,
    isCartEmpty
  } = useCart();

  const subtotal = getSubtotal();
  const volumeDiscount = getVolumeDiscount();
  const totalDiscount = getTotalDiscount();
  const finalTotal = getFinalTotal();

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'certificate':
        return <Award className="w-5 h-5 text-emerald-500" />;
      case 'wallet_card':
        return <IdCard className="w-5 h-5 text-blue-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleCheckout = () => {
    // Navigate to checkout page with cart data
    window.location.href = '/checkout';
  };

  if (isCartEmpty()) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white border-violet-500/30">
          <SheetHeader>
            <SheetTitle className="text-white">Shopping Cart</SheetTitle>
            <SheetDescription className="text-blue-200">
              Your cart is currently empty
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <ShoppingBag className="w-16 h-16 text-blue-300" />
            <p className="text-blue-200 text-center">
              Add certificates or wallet cards to get started
            </p>
            <Button 
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white border-violet-500/30">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({cartItems.length} items)
          </SheetTitle>
          <SheetDescription className="text-blue-200">
            Review your selected certificates and wallet cards
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full space-y-4 mt-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-blue-900/40 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getItemIcon(item.itemType)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{item.itemName}</h3>
                      <p className="text-blue-200 text-sm capitalize">
                        {item.itemType.replace('_', ' ')}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-white font-medium">
                          {formatPrice(item.unitPrice)} each
                        </span>
                        {item.discountApplied > 0 && (
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            -{formatPrice(item.discountApplied)} saved
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 p-0 border-white/20 text-white hover:bg-blue-800/50"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="text-white font-medium px-2 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 border-white/20 text-white hover:bg-blue-800/50"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Volume Discount Info */}
          {volumeDiscount && (
            <Card className="bg-green-900/40 border-green-500/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">
                    Volume Discount Applied
                  </span>
                </div>
                <p className="text-green-200 text-sm mt-1">
                  {volumeDiscount.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cart Summary */}
          <Card className="bg-blue-900/60 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-blue-200">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Volume Discount:</span>
                  <span>-{formatPrice(totalDiscount)}</span>
                </div>
              )}
              
              <div className="border-t border-white/10 pt-2">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pb-4">
            <Button 
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                Continue Shopping
              </Button>
              
              <Button 
                onClick={clearCart}
                variant="outline"
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-900/20"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}