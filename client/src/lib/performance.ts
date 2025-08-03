// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.set('lcp', entry.startTime);
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.set('fid', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    this.metrics.set('ttfb', entry.responseStart - entry.requestStart);
    this.metrics.set('domLoaded', entry.domContentLoadedEventEnd - entry.navigationStart);
    this.metrics.set('pageLoad', entry.loadEventEnd - entry.navigationStart);
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming) {
    if (entry.name.includes('.js')) {
      const jsSize = entry.transferSize || 0;
      const currentSize = this.metrics.get('totalJSSize') || 0;
      this.metrics.set('totalJSSize', currentSize + jsSize);
    }
    
    if (entry.name.includes('.css')) {
      const cssSize = entry.transferSize || 0;
      const currentSize = this.metrics.get('totalCSSSize') || 0;
      this.metrics.set('totalCSSSize', currentSize + cssSize);
    }
  }

  public markStart(name: string) {
    performance.mark(`${name}-start`);
  }

  public markEnd(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    if (measure) {
      this.metrics.set(name, measure.duration);
    }
  }

  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  public reportMetrics() {
    const metrics = this.getMetrics();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.table(metrics);
      console.groupEnd();
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      Object.entries(metrics).forEach(([name, value]) => {
        window.gtag('event', 'timing_complete', {
          name,
          value: Math.round(value),
        });
      });
    }

    return metrics;
  }

  public getCoreWebVitals() {
    return {
      lcp: this.metrics.get('lcp'),
      fid: this.metrics.get('fid'),
      cls: this.calculateCLS(),
    };
  }

  private calculateCLS(): number {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += (entry as any).value;
            sessionEntries.push(entry);
          } else {
            sessionValue = (entry as any).value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
          }
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    
    return clsValue;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  return {
    markStart: monitor.markStart.bind(monitor),
    markEnd: monitor.markEnd.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    reportMetrics: monitor.reportMetrics.bind(monitor),
    getCoreWebVitals: monitor.getCoreWebVitals.bind(monitor),
  };
}

// Utility functions for component performance tracking
export function withPerformanceTracking<T extends React.ComponentType<any>>(
  Component: T,
  componentName: string
): T {
  const WrappedComponent = (props: any) => {
    const monitor = PerformanceMonitor.getInstance();
    
    React.useEffect(() => {
      monitor.markStart(`component-${componentName}`);
      return () => {
        monitor.markEnd(`component-${componentName}`);
      };
    }, []);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent as T;
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  const monitor = PerformanceMonitor.getInstance();
  
  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitor.reportMetrics();
    }, 2000);
  });

  // Report metrics on page unload
  window.addEventListener('beforeunload', () => {
    monitor.reportMetrics();
  });

  return monitor;
}