import { useEffect } from 'react';

export function CopyrightProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common developer shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    // Add copyright notice to console
    console.log('%c⚠️ COPYRIGHT NOTICE', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cThis website and its content are protected by copyright law.', 'color: red; font-size: 14px;');
    console.log('%cUnauthorized copying, reproduction, or distribution is prohibited.', 'color: red; font-size: 14px;');
    console.log('%c© 2025 SafetySync Software. All rights reserved.', 'color: red; font-size: 14px;');

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return null;
}