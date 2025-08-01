// Simplified Clarity Analytics Tracking for SafetySync.AI
// Uses clean patterns provided by user

// Track specific user events throughout the platform
const logClarity = (name: string, value: any) => {
  if (window.clarity) window.clarity('set', name, value);
};

export const trackClarityEvent = logClarity;

// Common tracking functions for SafetySync.AI platform
export const clarityTracking = {
  // Landing page interactions
  comparisonModalOpened: () => logClarity('comparison_modal_opened', true),
  faqOpened: (question: string) => logClarity('faq_opened', question),
  
  // User engagement
  trialSignupStarted: () => logClarity('trial_signup_started', true),
  demoRequestStarted: () => logClarity('demo_request_started', true),
  workspaceAccessed: () => logClarity('workspace_accessed', true),
  
  // Platform usage
  documentUploaded: (fileType: string) => logClarity('document_uploaded', fileType),
  certificateGenerated: (certType: string) => logClarity('certificate_generated', certType),
  
  // Navigation tracking
  pageVisited: (pageName: string) => logClarity('page_visited', pageName),
  
  // Conversion events
  accountCreated: (planType: string) => logClarity('account_created', planType),
  loginCompleted: () => logClarity('login_completed', true),
  subscriptionStarted: (planName: string) => logClarity('subscription_started', planName)
};

// Export for easy integration
export default clarityTracking;