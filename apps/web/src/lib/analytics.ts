type AnalyticsEvent = {
  event: string;
  properties?: Record<string, string | number | boolean>;
};

type QueueEvent = AnalyticsEvent & { timestamp: number };

const queuedEvents: QueueEvent[] = [];
let scriptLoaded = false;
let scriptRequested = false;

const PLAUSIBLE_ENDPOINT =
  "https://plausible.io/js/script.tagged-events.outbound-links.js";

/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
    mawuAnalyticsDebug?: boolean;
  }
}
/* eslint-enable no-unused-vars */

const getDomain = () =>
  import.meta.env.VITE_ANALYTICS_DOMAIN as string | undefined;

const debug = (...args: unknown[]) => {
  if (import.meta.env.DEV || window.mawuAnalyticsDebug) {
    console.info("[analytics]", ...args);
  }
};

const flushQueue = () => {
  if (!scriptLoaded || typeof window.plausible !== "function") {
    return;
  }

  while (queuedEvents.length) {
    const item = queuedEvents.shift();
    if (!item) {
      continue;
    }
    window.plausible(
      item.event,
      item.properties ? { props: item.properties } : undefined,
    );
  }
};

export const initAnalytics = () => {
  const domain = getDomain();
  if (!domain || scriptRequested) {
    return;
  }

  scriptRequested = true;

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-mawu-analytics="plausible"]',
  );
  if (existing) {
    scriptLoaded = true;
    flushQueue();
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.setAttribute("data-domain", domain);
  script.setAttribute("data-mawu-analytics", "plausible");
  script.src = PLAUSIBLE_ENDPOINT;
  script.addEventListener("load", () => {
    scriptLoaded = true;
    debug("Plausible analytics loaded");
    flushQueue();
  });
  script.addEventListener("error", () => {
    debug("Failed to load analytics script");
  });

  document.head.appendChild(script);
};

export const trackEvent = (
  event: string,
  properties?: AnalyticsEvent["properties"],
) => {
  const payload: QueueEvent = {
    event,
    properties,
    timestamp: Date.now(),
  };

  if (typeof window.plausible === "function") {
    debug("event", event, properties);
    window.plausible(event, properties ? { props: properties } : undefined);
    return;
  }

  debug("queue", event, properties);
  queuedEvents.push(payload);
};
export {};
