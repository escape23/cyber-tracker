"use client";

import * as React from "react";

/* Same-tab writes don't fire the native "storage" event, so we dispatch
   this custom event to keep every subscribed component in sync. */
const LOCAL_EVENT = "local-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

const emptySubscribe = () => () => {};

/**
 * Persistent state backed by localStorage, safe for SSR/hydration.
 *
 * Built on useSyncExternalStore: the server (and hydration) render uses
 * `initialValue`, then the client re-renders with the stored value —
 * no hydration mismatch. Updates propagate to every component using the
 * same key, and across tabs via the native "storage" event.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = React.useRef(initialValue);
  /* getSnapshot must return referentially stable values, so cache the
     parsed result per raw string. */
  const cacheRef = React.useRef<{ raw: string | null; parsed: T }>({
    raw: null,
    parsed: initialValue,
  });

  const getSnapshot = React.useCallback((): T => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      // Storage blocked — behave as if nothing is stored.
    }
    if (raw === cacheRef.current.raw) {
      return cacheRef.current.parsed;
    }
    let parsed: T;
    if (raw === null) {
      parsed = initialRef.current;
    } else {
      try {
        parsed = JSON.parse(raw) as T;
      } catch {
        parsed = initialRef.current;
      }
    }
    cacheRef.current = { raw, parsed };
    return parsed;
  }, [key]);

  const getServerSnapshot = React.useCallback(
    (): T => initialRef.current,
    []
  );

  const value = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const set = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      try {
        const raw = window.localStorage.getItem(key);
        let prev: T;
        try {
          prev = raw === null ? initialRef.current : (JSON.parse(raw) as T);
        } catch {
          prev = initialRef.current;
        }
        const resolved = next instanceof Function ? next(prev) : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(new Event(LOCAL_EVENT));
      } catch {
        // Storage full or blocked — nothing to persist.
      }
    },
    [key]
  );

  /* true once the client snapshot is in use (i.e. after hydration). */
  const hydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return [value, set, hydrated] as const;
}
