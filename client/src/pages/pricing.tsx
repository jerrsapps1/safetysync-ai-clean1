import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingCalculator } from "@/components/ui/pricing-calculator";
import { FAQSection } from "@/components/ui/faq-section";
import { LiveChatWidget } from "@/components/ui/live-chat-widget";
import { PageHeader } from "@/components/ui/page-header";
import ShoppingCartButton from "@/components/shopping-cart/ShoppingCartButton";
import { useCart } from "@/contexts/CartContext";
import { MessageCircle, Award, IdCard, ShoppingCart, Zap } from "lucide-react";
import SupportSection from "@/components/SupportSection";

export default function PricingPage() {
  const [showChat, setShowChat] = useState(false);
  const { addToCart } = useCart();

  // Track page visit with Clarity analytics
  useEffect(() => {
    if (window.clarity) window.clarity('set', 'page_visited', 'pricing');
  }, []);

  const handleAddToCart = (itemType: 'certificate' | 'wallet_card', quantity: number) => {
    const itemName = itemType === 'certificate' ? 'OSHA Training Certificate' : 'Digital Wallet Card';
    addToCart({
      itemType,
      itemName,
      quantity,
      unitPrice: 5.95,
      metadata: {
        source: 'pricing_page',
        description: `Pre-purchase of ${quantity} ${itemType === 'certificate' ? 'certificates' : 'wallet cards'}`
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <PageHeader />

      {/* Main Content with Sidebar Margin */}
      <div className="md:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8">
            Join and realize the savings in time and money through using SafetySync.AI. All plans include our core compliance features 
            with a 6-hour trial and no setup fees.
          </p>
          
          {/* Shopping Cart Button */}
          <div className="flex justify-center mb-8">
            <ShoppingCartButton 
              variant="outline" 
              size="lg"
              className="bg-blue-600/20 border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Certificate & Digital Card Pre-Purchase */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Pre-Purchase Certificates & Digital Cards</h2>
            <p className="text-xl text-white mb-8">
              Buy certificates and wallet cards in advance and save with volume discounts. All items are $5.95 each.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Certificates */}
            <Card className="bg-blue-900/40 border-blue-400/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="w-12 h-12 text-emerald-400" />
                </div>
                <CardTitle className="text-white text-2xl">OSHA Training Certificates</CardTitle>
                <CardDescription className="text-blue-200">
                  Professional certificates for all OSHA training programs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white">$5.95</div>
                  <div className="text-blue-200">per certificate</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAddToCart('certificate', 10)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    +10 Certificates
                  </Button>
                  <Button
                    onClick={() => handleAddToCart('certificate', 25)}
                    variant="outline"
                    className="border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
                  >
                    +25 Certificates
                  </Button>
                  <Button
                    onClick={() => handleAddToCart('certificate', 50)}
                    variant="outline"
                    className="border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
                  >
                    +50 Certificates
                  </Button>
                  <Button
                    onClick={() => handleAddToCart('certificate', 75)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                  >
                    +75 Certificates
                  </Button>
                </div>
                
                <div className="text-center text-sm text-blue-300">
                  Volume discounts automatically applied at checkout
                </div>
              </CardContent>
            </Card>

            {/* Digital Wallet Cards */}
            <Card className="bg-blue-900/40 border-blue-400/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <IdCard className="w-12 h-12 text-blue-400" />
                </div>
                <CardTitle className="text-white text-2xl">Digital Wallet Cards</CardTitle>
                <CardDescription className="text-blue-200">
                  Mobile-ready certification cards with QR verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white">$5.95</div>
                  <div className="text-blue-200">per wallet card</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAddToCart('wallet_card', 10)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    +10 Cards
                  </Button>
                  <Button
                    onClick={() => handleAddToCart('wallet_card', 25)}
                    variant="outline"
                    className="border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
                  >
                    +25 Cards
                  </Button>
                  <Button
                    onClick={() => handleAddToCart('wallet_card', 50)}
                    variant="outline"
                    className="border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
                  >
                    +50 Cards
                  </Button>
                  <Button
                    onClick={() => handleAddToCart('wallet_card', 75)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    +75 Cards
                  </Button>
                </div>
                
                <div className="text-center text-sm text-blue-300">
                  Volume discounts automatically applied at checkout
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Volume Discount Information */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Volume Discount Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="text-green-200">
                    <div className="font-bold text-lg">10% OFF</div>
                    <div className="text-sm">15-29 items</div>
                  </div>
                  <div className="text-green-200">
                    <div className="font-bold text-lg">15% OFF</div>
                    <div className="text-sm">30-49 items</div>
                  </div>
                  <div className="text-green-200">
                    <div className="font-bold text-lg">20% OFF</div>
                    <div className="text-sm">50-74 items</div>
                  </div>
                  <div className="text-green-200">
                    <div className="font-bold text-lg">25% OFF</div>
                    <div className="text-sm">75+ items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="mb-20">
          <PricingCalculator 
            onSelectPlan={(plan, cost) => {
              console.log(`Selected ${plan} plan at $${cost}/year`);
            }}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <FAQSection />
        </section>

        {/* Support Section */}
        <section className="mb-20">
          <SupportSection />
        </section>

        {/* Live Chat */}
        {showChat && (
          <LiveChatWidget 
            isOpen={showChat}
            onToggle={() => setShowChat(!showChat)}
            onClose={() => setShowChat(false)}
          />
        )}

        {/* Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowChat(!showChat)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>

        </div>
      </div>
    </div>
  );
}