import { Logger } from './logger';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const Analytics = {
  init() {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
      });
      Logger.info('Analytics initialized');
    }
  },

  trackPageView(url: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
    Logger.info(`Pageview: ${url}`);
  },

  trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
  ) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
    Logger.info(`Event: ${category} - ${action}`, { label, value });
  },
};
