/**
 * Settings Management Utility
 * Handles all localStorage operations for user preferences
 */

export interface AppSettings {
  showBengali: boolean;
  showDetails: boolean;
  arabicFont: string;
  fontSize: number;
  selectedReciterId: number;
  rangeEnabled: boolean;
  rangeStart: number;
  rangeEnd: number;
}

const SETTINGS_KEY = "nextverse-settings";
const SURAHS_CACHE_KEY = "nextverse-surahs-cache";

export const defaultSettings: AppSettings = {
  showBengali: true,
  showDetails: false,
  arabicFont: "font-arabic",
  fontSize: 32,
  selectedReciterId: 4,
  rangeEnabled: false,
  rangeStart: 1,
  rangeEnd: 114,
};

/**
 * Load settings from localStorage, merge with defaults
 */
export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return { ...defaultSettings };
    const parsed = JSON.parse(stored);
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;

  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
}

/**
 * Reset all settings to defaults
 */
export function resetSettings(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (err) {
    console.error("Failed to reset settings:", err);
  }
}

/**
 * Cache Surahs data to localStorage
 */
export function cacheSurahData(
  surahs: Array<{ number: number; name: string; englishName: string; numberOfAyahs: number }>
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SURAHS_CACHE_KEY, JSON.stringify(surahs));
  } catch (err) {
    console.error("Failed to cache surahs:", err);
  }
}

/**
 * Retrieve cached Surahs data
 */
export function getCachedSurahs(): Array<{ number: number; name: string; englishName: string; numberOfAyahs: number }> | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(SURAHS_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error("Failed to retrieve cached surahs:", err);
    return null;
  }
}
