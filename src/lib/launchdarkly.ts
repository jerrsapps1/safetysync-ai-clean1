// LaunchDarkly Feature Flag Integration for SafetySync.AI
// Replaces custom A/B testing with professional feature flag management

import { initialize, LDClient, LDContext } from 'launchdarkly-js-client-sdk';

export interface LaunchDarklyConfig {
  clientSideId: string;
  context: LDContext;
  options?: {
    flushInterval?: number;
    capacity?: number;
    eventsUrl?: string;
  };
}

class LaunchDarklyService {
  private client: LDClient | null = null;
  private isInitialized: boolean = false;

  async initialize(config: LaunchDarklyConfig): Promise<void> {
    try {
      // Use the events URL from your shared endpoint
      const defaultOptions = {
        flushInterval: 30, // seconds
        capacity: 1000,
        eventsUrl: 'https://events.launchdarkly.com', // Your shared endpoint domain
        ...config.options
      };

      this.client = initialize(config.clientSideId, config.context, defaultOptions);
      
      await this.client.waitForInitialization();
      this.isInitialized = true;
      
      console.log('🏃 LaunchDarkly initialized successfully');
      
      // Set up automatic event flushing on page unload
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          this.flush();
        });
      }
      
    } catch (error) {
      console.error('❌ LaunchDarkly initialization failed:', error);
      throw error;
    }
  }

  // Get feature flag value
  getFlag<T>(flagKey: string, defaultValue: T): T {
    if (!this.isInitialized || !this.client) {
      console.warn(`⚠️ LaunchDarkly not initialized, returning default for flag: ${flagKey}`);
      return defaultValue;
    }

    try {
      return this.client.variation(flagKey, defaultValue);
    } catch (error) {
      console.error(`❌ Error getting flag ${flagKey}:`, error);
      return defaultValue;
    }
  }

  // Track custom events (sent via bulk endpoint)
  track(eventKey: string, data?: any, metricValue?: number): void {
    if (!this.isInitialized || !this.client) {
      console.warn(`⚠️ LaunchDarkly not initialized, cannot track event: ${eventKey}`);
      return;
    }

    try {
      this.client.track(eventKey, data, metricValue);
      console.log(`📊 Tracked event: ${eventKey}`, data);
    } catch (error) {
      console.error(`❌ Error tracking event ${eventKey}:`, error);
    }
  }

  // Force immediate event submission
  flush(): void {
    if (this.client) {
      this.client.flush();
      console.log('🚀 LaunchDarkly events flushed');
    }
  }

  // Check if a flag exists and is enabled
  isFlagEnabled(flagKey: string): boolean {
    return this.getFlag(flagKey, false);
  }

  // Get multiple flags at once
  getAllFlags(): Record<string, any> {
    if (!this.isInitialized || !this.client) {
      console.warn('⚠️ LaunchDarkly not initialized, returning empty flags');
      return {};
    }

    try {
      return this.client.allFlags();
    } catch (error) {
      console.error('❌ Error getting all flags:', error);
      return {};
    }
  }

  // Update user context for targeting
  async updateContext(newContext: LDContext): Promise<void> {
    if (!this.client) {
      throw new Error('LaunchDarkly not initialized');
    }

    try {
      await this.client.identify(newContext);
      console.log('👤 LaunchDarkly context updated', newContext);
    } catch (error) {
      console.error('❌ Error updating context:', error);
      throw error;
    }
  }

  // Close connection
  close(): void {
    if (this.client) {
      this.client.close();
      this.isInitialized = false;
      console.log('🔒 LaunchDarkly connection closed');
    }
  }
}

// Singleton instance
export const launchDarkly = new LaunchDarklyService();

// Feature flag constants (replace your A/B test variants)
export const FEATURE_FLAGS = {
  // Hero section variants
  HERO_CTA_TEXT: 'hero-cta-text',
  HERO_CTA_COLOR: 'hero-cta-color',
  
  // Pricing display variants
  PRICING_DISPLAY: 'pricing-display-strategy',
  SHOW_ANNUAL_SAVINGS: 'show-annual-savings',
  
  // New features
  SHOW_COMPARISON_MODAL: 'show-comparison-modal',
  ENABLE_LIVE_CHAT: 'enable-live-chat',
  SHOW_PRODUCT_TOUR: 'show-product-tour',
  
  // Platform features
  ENABLE_ADVANCED_ANALYTICS: 'enable-advanced-analytics',
  SHOW_LIFER_COUNT: 'show-lifer-count',
  ENABLE_EMAIL_AUTOMATION: 'enable-email-automation'
} as const;

// Event tracking constants (sent to your bulk endpoint)
export const LAUNCHDARKLY_EVENTS = {
  // Conversion events
  TRIAL_SIGNUP_STARTED: 'trial-signup-started',
  TRIAL_SIGNUP_COMPLETED: 'trial-signup-completed',
  DEMO_REQUEST_SUBMITTED: 'demo-request-submitted',
  
  // Engagement events
  COMPARISON_MODAL_OPENED: 'comparison-modal-opened',
  PRODUCT_TOUR_STARTED: 'product-tour-started',
  LIVE_CHAT_OPENED: 'live-chat-opened',
  
  // Page events
  LANDING_PAGE_VIEWED: 'landing-page-viewed',
  PRICING_PAGE_VIEWED: 'pricing-page-viewed',
  WORKSPACE_ACCESSED: 'workspace-accessed',
  
  // CTA events
  CTA_CLICKED: 'cta-clicked',
  PRICING_CTA_CLICKED: 'pricing-cta-clicked'
} as const;

// Helper function to initialize LaunchDarkly with user context
export async function initializeLaunchDarkly(user?: any): Promise<void> {
  // You'll need to set your LaunchDarkly client-side ID
  const clientSideId = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID || 'your-client-side-id';
  
  const context: LDContext = {
    kind: 'user',
    key: user?.id?.toString() || 'anonymous-user',
    name: user?.name || 'Anonymous User',
    email: user?.email,
    custom: {
      company: user?.company,
      userTier: user?.userTier || 'free_trial',
      isAdmin: user?.isAdmin || false
    }
  };

  await launchDarkly.initialize({
    clientSideId,
    context,
    options: {
      flushInterval: 30,
      capacity: 1000,
      eventsUrl: 'https://events.launchdarkly.com' // Your shared endpoint
    }
  });
}

// Hook for React components
export function useLaunchDarkly() {
  return {
    getFlag: launchDarkly.getFlag.bind(launchDarkly),
    track: launchDarkly.track.bind(launchDarkly),
    isFlagEnabled: launchDarkly.isFlagEnabled.bind(launchDarkly),
    getAllFlags: launchDarkly.getAllFlags.bind(launchDarkly),
    flush: launchDarkly.flush.bind(launchDarkly)
  };
}