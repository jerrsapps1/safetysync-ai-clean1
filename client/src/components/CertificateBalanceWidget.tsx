import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  IdCard, 
  ShoppingCart, 
  AlertTriangle,
  Plus,
  Zap
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CertificateBalanceWidgetProps {
  className?: string;
}

// Mock data - this would come from user balances API
const mockBalances = {
  certificatesRemaining: 3,
  walletCardsRemaining: 7,
  totalPurchased: 50,
  lowBalanceThreshold: 5
};

export default function CertificateBalanceWidget({ className = '' }: CertificateBalanceWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useCart();

  const { certificatesRemaining, walletCardsRemaining, totalPurchased, lowBalanceThreshold } = mockBalances;
  
  const isLowBalance = certificatesRemaining <= lowBalanceThreshold || walletCardsRemaining <= lowBalanceThreshold;
  const totalRemaining = certificatesRemaining + walletCardsRemaining;
  const usagePercentage = ((totalPurchased - totalRemaining) / totalPurchased) * 100;

  const handleQuickPurchase = (itemType: 'certificate' | 'wallet_card', quantity: number = 10) => {
    addToCart({
      itemType,
      itemName: itemType === 'certificate' ? 'OSHA Training Certificate' : 'Digital Wallet Card',
      quantity,
      unitPrice: 5.95,
      metadata: { 
        quickPurchase: true,
        description: `Quick purchase of ${quantity} ${itemType === 'certificate' ? 'certificates' : 'wallet cards'}`
      }
    });
  };

  return (
    <Card className={`bg-blue-900/40 border-blue-400/30 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Certificate Balance
          </div>
          {isLowBalance && (
            <Badge variant="destructive" className="bg-red-600">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Low
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Balance Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-blue-200 text-sm">Certificates</span>
            </div>
            <div className="text-white font-bold text-lg">{certificatesRemaining}</div>
            <div className="text-blue-300 text-xs">remaining</div>
          </div>
          
          <div className="bg-blue-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <IdCard className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200 text-sm">Wallet Cards</span>
            </div>
            <div className="text-white font-bold text-lg">{walletCardsRemaining}</div>
            <div className="text-blue-300 text-xs">remaining</div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">Usage Progress</span>
            <span className="text-white">{Math.round(usagePercentage)}%</span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-2 bg-blue-800/50" 
          />
          <div className="text-xs text-blue-300">
            {totalRemaining} of {totalPurchased} items remaining
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
            className="w-full border-blue-400/30 text-white hover:bg-blue-800/30"
          >
            <Plus className="w-3 h-3 mr-2" />
            Quick Purchase
          </Button>
          
          {isExpanded && (
            <div className="space-y-2 pt-2 border-t border-blue-400/30">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleQuickPurchase('certificate', 10)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  <Award className="w-3 h-3 mr-1" />
                  +10 Certs
                </Button>
                
                <Button
                  onClick={() => handleQuickPurchase('wallet_card', 10)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  <IdCard className="w-3 h-3 mr-1" />
                  +10 Cards
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleQuickPurchase('certificate', 25)}
                  size="sm"
                  variant="outline"
                  className="border-blue-400/30 text-white hover:bg-blue-800/30 text-xs"
                >
                  +25 Certs
                </Button>
                
                <Button
                  onClick={() => handleQuickPurchase('wallet_card', 25)}
                  size="sm"
                  variant="outline"
                  className="border-blue-400/30 text-white hover:bg-blue-800/30 text-xs"
                >
                  +25 Cards
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Low Balance Warning */}
        {isLowBalance && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium text-sm">Low Balance Alert</span>
            </div>
            <p className="text-red-200 text-xs">
              You're running low on certificates or wallet cards. Purchase more to avoid interruption.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}