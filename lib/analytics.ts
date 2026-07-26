export const ANALYTICS_CONSENT_KEY = "trp-analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "trp-analytics-consent-changed";

type AnalyticsValue = string | number | boolean | undefined;
export type AnalyticsParameters = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function hasAnalyticsConsent(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted";
}

function cleanParameters(parameters: AnalyticsParameters): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(parameters).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined),
  );
}

export function trackAnalyticsEvent(eventName: string, parameters: AnalyticsParameters = {}): void {
  if (!hasAnalyticsConsent()) return;

  const cleaned = cleanParameters(parameters);
  const usesTagManager = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  window.dataLayer = window.dataLayer || [];

  if (usesTagManager) {
    window.dataLayer.push({ event: eventName, ...cleaned });
    return;
  }

  if (measurementId) {
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("event", eventName, cleaned);
  }
}
