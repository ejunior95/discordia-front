import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PREFERENCES, PREFERENCES_STORAGE_KEY } from '../account.constants';
import type { UserPreferences } from '../types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base;
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const value = (override as Record<string, unknown>)[key];
    const baseValue = (base as Record<string, unknown>)[key];
    if (isPlainObject(value) && isPlainObject(baseValue)) {
      result[key] = deepMerge(baseValue, value as Partial<typeof baseValue>);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = sessionStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return deepMerge(DEFAULT_PREFERENCES, parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

  useEffect(() => {
    try {
      sessionStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // storage cheio ou indisponível: silenciar
    }
  }, [preferences]);

  const update = useCallback((patch: Partial<UserPreferences>) => {
    setPreferences((prev) => deepMerge(prev, patch));
  }, []);

  const reset = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return { preferences, update, reset };
}
