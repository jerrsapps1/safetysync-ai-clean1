import { cloneDetector } from "./ai-clone-detection";

// Initialize clone detector with SafetySync's original content
export async function initializeCloneDetector() {
  try {
    // Get the current SafetySync website content
    const response = await fetch('http://localhost:5000/', {
      headers: { 'User-Agent': 'SafetySync Clone Detector Init 1.0' }
    });
    
    if (response.ok) {
      const html = await response.text();
      await cloneDetector.setOriginalWebsite(html, 'https://safetysync.replit.app');
      console.log('✓ Clone detector initialized with original SafetySync content');
    } else {
      console.warn('⚠ Could not fetch original website content for clone detection');
    }
  } catch (error) {
    console.error('✗ Failed to initialize clone detector:', error);
  }
}

// Initialize after server starts
setTimeout(initializeCloneDetector, 3000);