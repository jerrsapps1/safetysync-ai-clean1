// Analytics and Conversion Tracking Utilities
// This module provides centralized tracking for all conversion events

interface ConversionEvent {
  event: string;
  action: string;
  category: string;
  label?: string;
  value?: number;
  currency?: string;
}

// Google Analytics 4 Event Tracking
export const trackGAEvent = (event: ConversionEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      currency: event.currency,
    });
  }
};

// Facebook Pixel Event Tracking
export const trackFBEvent = (event: ConversionEvent) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event.event, {
      content_name: event.label,
      value: event.value,
      currency: event.currency,
    });
  }
};

// Microsoft Clarity Event Tracking
export const trackClarityEvent = (event: ConversionEvent) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', event.action, event.label);
  }
};

// Unified tracking function
export const trackConversionEvent = (event: ConversionEvent) => {
  trackGAEvent(event);
  trackFBEvent(event);
  trackClarityEvent(event);
  
  // Console log for debugging
  console.log('Conversion Event:', event);
};

// Pre-defined conversion events
export const CONVERSION_EVENTS = {
  TRIAL_SIGNUP_STARTED: {
    event: 'Lead',
    action: 'trial_signup_started',
    category: 'engagement',
    label: 'Trial Signup Form Opened',
  },
  TRIAL_SIGNUP_COMPLETED: {
    event: 'Lead',
    action: 'trial_signup_completed',
    category: 'conversion',
    label: 'Trial Signup Completed',
    value: 49, // Base monthly value
    currency: 'USD',
  },
  DEMO_REQUEST_STARTED: {
    event: 'Lead',
    action: 'demo_request_started',
    category: 'engagement',
    label: 'Demo Request Form Opened',
  },
  DEMO_REQUEST_COMPLETED: {
    event: 'Lead',
    action: 'demo_request_completed',
    category: 'conversion',
    label: 'Demo Request Completed',
    value: 200, // Estimated demo value
    currency: 'USD',
  },
  PRICING_CALCULATOR_USED: {
    event: 'Custom',
    action: 'pricing_calculator_used',
    category: 'engagement',
    label: 'Pricing Calculator Interaction',
  },
  PRODUCT_TOUR_STARTED: {
    event: 'Custom',
    action: 'product_tour_started',
    category: 'engagement',
    label: 'Product Tour Started',
  },
  PRODUCT_TOUR_COMPLETED: {
    event: 'Custom',
    action: 'product_tour_completed',
    category: 'engagement',
    label: 'Product Tour Completed',
  },
  LIVE_CHAT_OPENED: {
    event: 'Custom',
    action: 'live_chat_opened',
    category: 'engagement',
    label: 'Live Chat Widget Opened',
  },
  TERMS_ACCEPTED: {
    event: 'Custom',
    action: 'terms_accepted',
    category: 'conversion',
    label: 'Terms and Conditions Accepted',
  },
  PRICING_PAGE_VIEWED: {
    event: 'ViewContent',
    action: 'pricing_page_viewed',
    category: 'page_view',
    label: 'Pricing Page Viewed',
  },
  CASE_STUDIES_VIEWED: {
    event: 'ViewContent',
    action: 'case_studies_viewed',
    category: 'page_view',
    label: 'Case Studies Page Viewed',
  },
};

// Page view tracking
export const trackPageView = (pageName: string) => {
  trackConversionEvent({
    event: 'PageView',
    action: 'page_view',
    category: 'navigation',
    label: pageName,
  });
};

// Form interaction tracking
export const trackFormInteraction = (formName: string, action: string) => {
  trackConversionEvent({
    event: 'Custom',
    action: `form_${action}`,
    category: 'form_interaction',
    label: formName,
  });
};

// Button click tracking
export const trackButtonClick = (buttonName: string, context: string) => {
  trackConversionEvent({
    event: 'Custom',
    action: 'button_click',
    category: 'engagement',
    label: `${buttonName} - ${context}`,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number) => {
  trackConversionEvent({
    event: 'Custom',
    action: 'scroll_depth',
    category: 'engagement',
    label: `${depth}% Scroll Depth`,
    value: depth,
  });
};

// Time on page tracking
export const trackTimeOnPage = (seconds: number, pageName: string) => {
  trackConversionEvent({
    event: 'Custom',
    action: 'time_on_page',
    category: 'engagement',
    label: pageName,
    value: seconds,
  });
};

// Declare global gtag and fbq functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

export default {
  trackConversionEvent,
  trackPageView,
  trackFormInteraction,
  trackButtonClick,
  trackScrollDepth,
  trackTimeOnPage,
  CONVERSION_EVENTS,
};