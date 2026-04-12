import { useState, useEffect, useCallback } from "react";

const DEFAULT_KEY = "bluemarlin_read_conversations";
const EVENT_PREFIX = "bluemarlin:readStatus:";

const HIDDEN_KEY = "bluemarlin_hidden_conversations";
const HIDDEN_EVENT = "bluemarlin:hidden";

function loadHiddenSet(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

export function useHiddenSet(): Set<string> {
  const [hiddenSet, setHiddenSet] = useState<Set<string>>(() => loadHiddenSet());
  useEffect(() => {
    const handler = () => setHiddenSet(loadHiddenSet());
    window.addEventListener(HIDDEN_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(HIDDEN_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return hiddenSet;
}

export function loadReadSet(storageKey = DEFAULT_KEY): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveReadSet(next: Set<string>, storageKey: string) {
  localStorage.setItem(storageKey, JSON.stringify([...next]));
  window.dispatchEvent(new Event(EVENT_PREFIX + storageKey));
}

export function useReadStatus(storageKey = DEFAULT_KEY) {
  const [readSet, setReadSet] = useState<Set<string>>(() => loadReadSet(storageKey));

  useEffect(() => {
    const handler = () => setReadSet(loadReadSet(storageKey));
    window.addEventListener(EVENT_PREFIX + storageKey, handler);
    return () => window.removeEventListener(EVENT_PREFIX + storageKey, handler);
  }, [storageKey]);

  const markRead = useCallback((id: string) => {
    const next = new Set(loadReadSet(storageKey));
    next.add(id);
    saveReadSet(next, storageKey);
    setReadSet(new Set(next));
  }, [storageKey]);

  const markUnread = useCallback((id: string) => {
    const next = new Set(loadReadSet(storageKey));
    next.delete(id);
    saveReadSet(next, storageKey);
    setReadSet(new Set(next));
  }, [storageKey]);

  return { readSet, markRead, markUnread };
}
