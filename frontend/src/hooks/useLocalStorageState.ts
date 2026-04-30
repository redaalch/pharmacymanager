import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      return;
    }
  }, [key, state]);

  return [state, setState] as const;
}
