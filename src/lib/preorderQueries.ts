/**
 * Type definitions for the pre-order settings document.
 * Managed locally in data/preorder-settings.json and API routes.
 */

export interface PreorderSettings {
  isPaused: boolean;
  resumeDate: string | null;        // YYYY-MM-DD
  resumeTime: string | null;        // HH:mm
  pausedMessageEn: string | null;
  pausedMessageFi: string | null;
  isDeliveryEnabled?: boolean;
}
