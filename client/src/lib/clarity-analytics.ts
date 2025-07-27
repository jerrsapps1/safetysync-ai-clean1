// Microsoft Clarity Analytics Integration for SafetySync.AI
// Track user interactions and conversion events

declare global {
  interface Window {
    clarity: (action: string, key: string, value: any) => void;
  }
}

export const clarity = {
  // Set custom tags for user segmentation
  set: (eventName: string, value: any) => {
    if (window.clarity) {
      window.clarity('set', eventName, value);
    }
  },

  // Track custom events
  event: (eventName: string) => {
    if (window.clarity) {
      window.clarity('event', eventName, {});
    }
  },

  // Track user actions with additional data
  track: (action: string, data?: Record<string, any>) => {
    if (window.clarity) {
      window.clarity('set', action, data || true);
    }
  }
};

// Pre-defined SafetySync.AI analytics events
export const CLARITY_EVENTS = {
  // Landing page interactions
  COMPARISON_MODAL_OPENED: 'comparison_modal_opened',
  PRICING_FAQ_OPENED: 'pricing_faq_opened',
  TRIAL_SIGNUP_STARTED: 'trial_signup_started',
  DEMO_REQUEST_STARTED: 'demo_request_started',
  
  // User engagement
  WORKSPACE_ACCESSED: 'workspace_accessed',
  DOCUMENT_UPLOADED: 'document_uploaded',
  CERTIFICATE_GENERATED: 'certificate_generated',
  
  // Navigation tracking
  HR_TEAMS_PAGE_VISITED: 'hr_teams_page_visited',
  PRICING_PAGE_VISITED: 'pricing_page_visited',
  CASE_STUDIES_VISITED: 'case_studies_visited',
  
  // Conversion events
  ACCOUNT_CREATED: 'account_created',
  LOGIN_COMPLETED: 'login_completed',
  SUBSCRIPTION_STARTED: 'subscription_started'
};

// Utility functions for common tracking scenarios
export const trackUserAction = (action: string, additionalData?: Record<string, any>) => {
  clarity.set(action, true);
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      clarity.set(`${action}_${key}`, value);
    });
  }
};

export const trackPageView = (pageName: string, userType?: string) => {
  clarity.set('page_view', pageName);
  if (userType) {
    clarity.set('user_type', userType);
  }
};

export const trackConversion = (conversionType: string, value?: number) => {
  clarity.set('conversion', conversionType);
  if (value) {
    clarity.set('conversion_value', value);
  }
};