import { cloneDetector } from "./ai-clone-detection";

// Initialize clone detector with SafetySync Software's original content
export async function initializeCloneDetector() {
  try {
    // Get the current SafetySync Software website content
    const response = await fetch('http://localhost:5000/', {
      headers: { 'User-Agent': 'SafetySync Software Clone Detector Init 1.0' }
    });
    
    if (response.ok) {
      const html = await response.text();
      await cloneDetector.setOriginalWebsite(html, 'https://safetysync.replit.app');
      console.log('✓ Clone detector initialized with original SafetySync Software content');
    } else {
      console.warn('⚠ Could not fetch original website content for clone detection');
    }
  } catch (error) {
    console.error('✗ Failed to initialize clone detector:', error);
  }
}

// Initialize after server starts
setTimeout(initializeCloneDetector, 3000);