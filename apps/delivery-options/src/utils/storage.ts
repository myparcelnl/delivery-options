const STORAGE_KEY_PREFIX = 'myparcel_delivery_options';

/**
 * Safely check if localStorage is available.
 */
const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const getStorageItem = <T>(key: string): T | undefined => {
  if (!isStorageAvailable()) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}:${key}`);

    if (!raw) {
      return undefined;
    }

    return JSON.parse(raw) as T;
  } catch {
    // Corrupt or non-JSON value; treat as missing.
    return undefined;
  }
};

export const setStorageItem = <T>(key: string, value: T | undefined): void => {
  if (!isStorageAvailable()) {
    return;
  }

  const fullKey = `${STORAGE_KEY_PREFIX}:${key}`;

  // If value is undefined, remove the key instead of storing "undefined".
  if (value === undefined) {
    window.localStorage.removeItem(fullKey);
    return;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(fullKey, serialized);
  } catch {
    // If serialization fails, do nothing.
  }
};

export const removeStorageItem = (key: string): void => {
  if (!isStorageAvailable()) {
    return;
  }

  window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}:${key}`);
};
