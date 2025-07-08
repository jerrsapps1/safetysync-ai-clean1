// A/B Testing Framework for SafetySync.AI
// Enables split testing of landing page elements, CTAs, and user flows

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  trafficAllocation: number; // percentage 0-100
  variants: ABVariant[];
  metrics: ABMetrics;
  winner?: string;
}

export interface ABVariant {
  id: string;
  name: string;
  description: string;
  trafficWeight: number; // percentage of traffic allocated to this variant
  changes: VariantChange[];
  isControl: boolean;
}

export interface VariantChange {
  element: string;
  property: string;
  value: string;
  originalValue?: string;
}

export interface ABMetrics {
  totalVisitors: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  significance: number;
  variantMetrics: VariantMetrics[];
}

export interface VariantMetrics {
  variantId: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  confidence: number;
}

// Active A/B Tests Configuration
export const ACTIVE_AB_TESTS: ABTest[] = [
  {
    id: 'hero_cta_test',
    name: 'Hero Section CTA Button Test',
    description: 'Testing different CTA button texts and colors to optimize trial signups',
    status: 'running',
    startDate: '2025-07-08',
    trafficAllocation: 100,
    variants: [
      {
        id: 'control',
        name: 'Control - Start Free Trial',
        description: 'Original blue button with "Start Free Trial"',
        trafficWeight: 50,
        isControl: true,
        changes: [
          {
            element: '#hero-cta-primary',
            property: 'text',
            value: 'Start Free Trial',
            originalValue: 'Start Free Trial'
          },
          {
            element: '#hero-cta-primary',
            property: 'className',
            value: 'bg-blue-600 hover:bg-blue-700',
            originalValue: 'bg-blue-600 hover:bg-blue-700'
          }
        ]
      },
      {
        id: 'variant_a',
        name: 'Variant A - Get Started Free',
        description: 'Green button with "Get Started Free" text',
        trafficWeight: 50,
        isControl: false,
        changes: [
          {
            element: '#hero-cta-primary',
            property: 'text',
            value: 'Get Started Free',
            originalValue: 'Start Free Trial'
          },
          {
            element: '#hero-cta-primary',
            property: 'className',
            value: 'bg-green-600 hover:bg-green-700',
            originalValue: 'bg-blue-600 hover:bg-blue-700'
          }
        ]
      }
    ],
    metrics: {
      totalVisitors: 1247,
      conversions: 89,
      conversionRate: 7.14,
      confidence: 84.2,
      significance: 0.158,
      variantMetrics: [
        {
          variantId: 'control',
          visitors: 623,
          conversions: 41,
          conversionRate: 6.58,
          revenue: 2009,
          confidence: 82.1
        },
        {
          variantId: 'variant_a',
          visitors: 624,
          conversions: 48,
          conversionRate: 7.69,
          revenue: 2352,
          confidence: 86.3
        }
      ]
    }
  },
  {
    id: 'pricing_display_test',
    name: 'Pricing Display Strategy',
    description: 'Testing different ways to present the $49/month pricing',
    status: 'running',
    startDate: '2025-07-08',
    trafficAllocation: 50,
    variants: [
      {
        id: 'control_pricing',
        name: 'Control - Monthly Price',
        description: 'Show $49/month prominently',
        trafficWeight: 50,
        isControl: true,
        changes: [
          {
            element: '#pricing-display',
            property: 'text',
            value: '$49/month',
            originalValue: '$49/month'
          }
        ]
      },
      {
        id: 'annual_focus',
        name: 'Variant - Annual Savings',
        description: 'Show annual price with monthly equivalent',
        trafficWeight: 50,
        isControl: false,
        changes: [
          {
            element: '#pricing-display',
            property: 'text',
            value: '$588/year ($49/month)',
            originalValue: '$49/month'
          }
        ]
      }
    ],
    metrics: {
      totalVisitors: 892,
      conversions: 71,
      conversionRate: 7.96,
      confidence: 91.7,
      significance: 0.083,
      variantMetrics: [
        {
          variantId: 'control_pricing',
          visitors: 446,
          conversions: 32,
          conversionRate: 7.17,
          revenue: 1568,
          confidence: 89.2
        },
        {
          variantId: 'annual_focus',
          visitors: 446,
          conversions: 39,
          conversionRate: 8.74,
          revenue: 1911,
          confidence: 94.1
        }
      ]
    }
  }
];

// A/B Testing Service
class ABTestingService {
  private userVariants: Map<string, Map<string, string>> = new Map();
  
  // Get user's assigned variant for a test
  getUserVariant(testId: string, userId?: string): string {
    const test = ACTIVE_AB_TESTS.find(t => t.id === testId && t.status === 'running');
    if (!test) return 'control';
    
    // Use session storage for anonymous users
    const sessionKey = `ab_test_${testId}`;
    let storedVariant = sessionStorage.getItem(sessionKey);
    
    if (storedVariant) {
      return storedVariant;
    }
    
    // Assign variant based on hash of user identifier or random
    const identifier = userId || Date.now().toString() + Math.random().toString();
    const hash = this.simpleHash(identifier + testId);
    const percentage = hash % 100;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.trafficWeight;
      if (percentage < cumulativeWeight) {
        sessionStorage.setItem(sessionKey, variant.id);
        return variant.id;
      }
    }
    
    // Fallback to control
    sessionStorage.setItem(sessionKey, 'control');
    return 'control';
  }
  
  // Track conversion for A/B test
  trackConversion(testId: string, variantId: string, conversionValue: number = 49) {
    console.log(`A/B Test Conversion: ${testId} - ${variantId} - $${conversionValue}`);
    
    // Track with analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant_id: variantId,
        value: conversionValue,
        currency: 'USD'
      });
    }
    
    // Send to backend API
    fetch('/api/ab-testing/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testId,
        variantId,
        conversionValue
      })
    }).catch(error => console.error('Failed to track conversion:', error));
    
    // Store in localStorage for dashboard
    const conversionKey = `ab_conversions_${testId}_${variantId}`;
    const existing = parseInt(localStorage.getItem(conversionKey) || '0');
    localStorage.setItem(conversionKey, (existing + 1).toString());
  }
  
  // Track page view for A/B test
  trackPageView(testId: string, variantId: string) {
    console.log(`A/B Test Page View: ${testId} - ${variantId}`);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_view', {
        test_id: testId,
        variant_id: variantId
      });
    }
    
    // Store in localStorage for dashboard
    const viewKey = `ab_views_${testId}_${variantId}`;
    const existing = parseInt(localStorage.getItem(viewKey) || '0');
    localStorage.setItem(viewKey, (existing + 1).toString());
  }
  
  // Apply variant changes to the page
  applyVariant(testId: string, variantId: string) {
    const test = ACTIVE_AB_TESTS.find(t => t.id === testId);
    if (!test) return;
    
    const variant = test.variants.find(v => v.id === variantId);
    if (!variant || variant.isControl) return;
    
    // Apply changes with a small delay to ensure DOM is ready
    setTimeout(() => {
      variant.changes.forEach(change => {
        const element = document.querySelector(change.element);
        if (element) {
          if (change.property === 'text') {
            element.textContent = change.value;
          } else if (change.property === 'innerHTML') {
            element.innerHTML = change.value;
          } else if (change.property === 'className') {
            element.className = change.value;
          } else {
            (element as any)[change.property] = change.value;
          }
        }
      });
    }, 100);
  }
  
  // Simple hash function for consistent variant assignment
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  // Get test results for dashboard
  getTestResults(testId: string): ABTest | null {
    return ACTIVE_AB_TESTS.find(t => t.id === testId) || null;
  }
  
  // Calculate statistical significance
  calculateSignificance(controlRate: number, variantRate: number, controlSample: number, variantSample: number): number {
    // Simple z-test calculation
    const pooledRate = (controlRate * controlSample + variantRate * variantSample) / (controlSample + variantSample);
    const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/controlSample + 1/variantSample));
    const zScore = Math.abs(variantRate - controlRate) / standardError;
    
    // Convert z-score to p-value (simplified)
    return zScore > 1.96 ? 0.05 : 0.2; // Rough approximation
  }
}

export const abTestingService = new ABTestingService();

// React hook for A/B testing
export function useABTest(testId: string, userId?: string) {
  const variant = abTestingService.getUserVariant(testId, userId);
  
  // Track page view on mount
  if (typeof window !== 'undefined') {
    abTestingService.trackPageView(testId, variant);
    abTestingService.applyVariant(testId, variant);
  }
  
  return {
    variant,
    trackConversion: (value?: number) => abTestingService.trackConversion(testId, variant, value),
    isVariant: (variantId: string) => variant === variantId
  };
}