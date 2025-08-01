import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ShoppingCartDrawer from './ShoppingCartDrawer';

interface ShoppingCartButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function ShoppingCartButton({ 
  className = '', 
  variant = 'outline',
  size = 'md' 
}: ShoppingCartButtonProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getTotalItems } = useCart();
  
  const totalItems = getTotalItems();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
        onClick={() => setIsDrawerOpen(true)}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Cart
        {totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </Button>
      
      <ShoppingCartDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}