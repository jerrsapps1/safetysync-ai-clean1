// Simplified Clarity Analytics Tracking for SafetySync.AI
// Uses clean patterns provided by user

// Track specific user events throughout the platform
export const trackClarityEvent = (eventName: string, value?: any) => {
  if (window.clarity) {
    window.clarity('set', eventName, value || true);
  }
};

// Common tracking functions for SafetySync.AI platform
export const clarityTracking = {
  // Landing page interactions
  comparisonModalOpened: () => trackClarityEvent('comparison_modal_opened', true),
  faqOpened: (question: string) => trackClarityEvent('faq_opened', question),
  
  // User engagement
  trialSignupStarted: () => trackClarityEvent('trial_signup_started', true),
  demoRequestStarted: () => trackClarityEvent('demo_request_started', true),
  workspaceAccessed: () => trackClarityEvent('workspace_accessed', true),
  
  // Platform usage
  documentUploaded: (fileType: string) => trackClarityEvent('document_uploaded', fileType),
  certificateGenerated: (certType: string) => trackClarityEvent('certificate_generated', certType),
  
  // Navigation tracking
  pageVisited: (pageName: string) => trackClarityEvent('page_visited', pageName),
  
  // Conversion events
  accountCreated: (planType: string) => trackClarityEvent('account_created', planType),
  loginCompleted: () => trackClarityEvent('login_completed', true),
  subscriptionStarted: (planName: string) => trackClarityEvent('subscription_started', planName)
};

// Export for easy integration
export default clarityTracking;