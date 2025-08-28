declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// [PRODUCTION CHECKLIST] Replace with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'YOUR_GA_MEASUREMENT_ID_HERE';

/**
 * Initializes the analytics service.
 * This should be called once when the application loads.
 */
export const init = () => {
  if (typeof window.gtag !== 'function') {
    console.warn('Google Analytics gtag.js script is not loaded.');
  }
};

/**
 * Tracks a page view event.
 * This should be called on initial page load and on every route change.
 * @param path - The path of the page being viewed (e.g., '#/about').
 * @param title - The title of the page.
 */
export const trackPageView = (path: string, title: string) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

/**
 * Tracks a custom event.
 * Use this for tracking user interactions like button clicks or form submissions.
 * @param eventName - The name of the event (e.g., 'button_click').
 * @param eventParams - An object of key-value pairs with additional event data.
 */
export const trackEvent = (
  eventName: string,
  eventParams: { [key: string]: string | number | undefined }
) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', eventName, eventParams);
};