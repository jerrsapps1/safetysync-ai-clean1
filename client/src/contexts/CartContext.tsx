import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  id: string;
  itemType: 'certificate' | 'wallet_card' | 'training_package' | 'ai_credits' | 'branding_package';
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  metadata?: any;
}

export interface VolumeDiscount {
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  description: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartId: string;
  addToCart: (item: Omit<CartItem, 'id' | 'totalPrice' | 'discountApplied'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getVolumeDiscount: () => VolumeDiscount | null;
  getTotalDiscount: () => number;
  getFinalTotal: () => number;
  isCartEmpty: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VOLUME_DISCOUNTS: VolumeDiscount[] = [
  { minQuantity: 15, maxQuantity: 29, discountPercentage: 10, description: "10% off for 15-29 items" },
  { minQuantity: 30, maxQuantity: 49, discountPercentage: 15, description: "15% off for 30-49 items" },
  { minQuantity: 50, maxQuantity: 74, discountPercentage: 20, description: "20% off for 50-74 items" },
  { minQuantity: 75, discountPercentage: 25, description: "25% off for 75+ items" }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('');

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('safetysync_cart_id');
    const savedCartItems = localStorage.getItem('safetysync_cart_items');
    
    if (savedCartId) {
      setCartId(savedCartId);
    } else {
      const newCartId = uuidv4();
      setCartId(newCartId);
      localStorage.setItem('safetysync_cart_id', newCartId);
    }

    if (savedCartItems) {
      try {
        const items = JSON.parse(savedCartItems);
        setCartItems(items);
      } catch (error) {
        console.error('Error parsing saved cart items:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('safetysync_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateVolumeDiscount = (totalQuantity: number): VolumeDiscount | null => {
    for (const discount of VOLUME_DISCOUNTS.reverse()) {
      if (totalQuantity >= discount.minQuantity && 
          (!discount.maxQuantity || totalQuantity <= discount.maxQuantity)) {
        return discount;
      }
    }
    return null;
  };

  const calculateItemPrice = (item: Omit<CartItem, 'id' | 'totalPrice' | 'discountApplied'>, allItems: CartItem[]): { totalPrice: number; discountApplied: number } => {
    const totalQuantity = allItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0) + item.quantity;
    const volumeDiscount = calculateVolumeDiscount(totalQuantity);
    
    const basePrice = item.unitPrice * item.quantity;
    const discountAmount = volumeDiscount ? (basePrice * volumeDiscount.discountPercentage / 100) : 0;
    
    return {
      totalPrice: basePrice - discountAmount,
      discountApplied: discountAmount
    };
  };

  const addToCart = (item: Omit<CartItem, 'id' | 'totalPrice' | 'discountApplied'>) => {
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.itemType === item.itemType && cartItem.itemName === item.itemName
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      
      // Recalculate prices for all items
      const recalculatedItems = updatedItems.map(cartItem => {
        const pricing = calculateItemPrice(cartItem, updatedItems.filter(i => i.id !== cartItem.id));
        return { ...cartItem, ...pricing };
      });
      
      setCartItems(recalculatedItems);
    } else {
      // Add new item
      const pricing = calculateItemPrice(item, cartItems);
      const newItem: CartItem = {
        id: uuidv4(),
        ...item,
        ...pricing
      };
      
      const updatedItems = [...cartItems, newItem];
      
      // Recalculate all items for volume discounts
      const recalculatedItems = updatedItems.map(cartItem => {
        const pricing = calculateItemPrice(cartItem, updatedItems.filter(i => i.id !== cartItem.id));
        return { ...cartItem, ...pricing };
      });
      
      setCartItems(recalculatedItems);
    }
  };

  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    
    // Recalculate prices after removal
    const recalculatedItems = updatedItems.map(cartItem => {
      const pricing = calculateItemPrice(cartItem, updatedItems.filter(i => i.id !== cartItem.id));
      return { ...cartItem, ...pricing };
    });
    
    setCartItems(recalculatedItems);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    // Recalculate prices for all items
    const recalculatedItems = updatedItems.map(cartItem => {
      const pricing = calculateItemPrice(cartItem, updatedItems.filter(i => i.id !== cartItem.id));
      return { ...cartItem, ...pricing };
    });
    
    setCartItems(recalculatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('safetysync_cart_items');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const getVolumeDiscount = () => {
    const totalQuantity = getTotalItems();
    return calculateVolumeDiscount(totalQuantity);
  };

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => total + item.discountApplied, 0);
  };

  const getFinalTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const isCartEmpty = () => {
    return cartItems.length === 0;
  };

  const contextValue: CartContextType = {
    cartItems,
    cartId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getVolumeDiscount,
    getTotalDiscount,
    getFinalTotal,
    isCartEmpty
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};