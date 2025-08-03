import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // optional: Tailwind or global styles
import { initializePerformanceMonitoring } from './lib/performance';

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  initializePerformanceMonitoring();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
