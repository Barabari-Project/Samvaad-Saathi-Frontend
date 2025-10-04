// utils/posthog.ts
"use client";

import posthog from "posthog-js";

// Type definitions
interface EventProperties {
  [key: string]: unknown;
}

interface UserProperties {
  [key: string]: unknown;
}

interface ErrorProperties {
  [key: string]: unknown;
}

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  properties: EventProperties = {}
): void => {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
};

/**
 * Track page views manually
 */
export const trackPageView = (path: string): void => {
  if (typeof window !== "undefined") {
    posthog.capture("$pageview", { $current_url: path });
  }
};

/**
 * Identify users
 */
export const identifyUser = (
  userId: string,
  properties: UserProperties = {}
): void => {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
};

/**
 * Track errors manually
 */
export const trackError = (
  error: Error,
  additionalProperties: ErrorProperties = {}
): void => {
  if (typeof window !== "undefined") {
    posthog.captureException(error, additionalProperties);
  }
};

/**
 * Track sign up events (useful for funnels)
 */
export const trackSignUp = (method: string = "email"): void => {
  trackEvent("user_signed_up", { method });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  location: string
): void => {
  trackEvent("button_clicked", {
    button_name: buttonName,
    location,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: UserProperties): void => {
  if (typeof window !== "undefined") {
    posthog.capture("$set", { $set: properties });
  }
};

/**
 * Reset user identification
 */
export const resetUser = (): void => {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
};
