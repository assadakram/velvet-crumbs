/**
 * Sanity GROQ query for the single pre-order settings document.
 * Fetches only the fields defined in the schema.
 */
export const PREORDER_SETTINGS_QUERY = `*[_type == "preorderSettings"][0]{
  isPaused,
  resumeDate,
  resumeTime,
  pausedMessageEn,
  pausedMessageFi
}`;

export interface PreorderSettings {
  isPaused: boolean;
  resumeDate: string | null;        // YYYY-MM-DD
  resumeTime: string | null;        // HH:mm
  pausedMessageEn: string | null;
  pausedMessageFi: string | null;
}
