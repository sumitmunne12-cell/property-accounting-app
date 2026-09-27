// Shared GAAP study state (progress + bookmarks), persisted in AsyncStorage and observed by the
// Codex list, the card viewer and the study session so every view updates together.
import { useEffect, useState } from 'react';
import { getAscStudy, saveAscStudy } from './storage';
import { emptyStudy, grade as gradeCard, normalizeStudy, toggleBookmark as toggle } from './studyEngine';

let current = emptyStudy();
let loaded = false;
let loading = null;
const listeners = new Set();

function set(next) {
  current = next;
  listeners.forEach((fn) => fn(current));
  // Never write before the stored state has been read and merged, or a fast first tap would wipe it.
  if (loaded) saveAscStudy(current);
  else ensureLoaded().then(() => saveAscStudy(current));
}

function ensureLoaded() {
  if (loaded || loading) return loading;
  loading = getAscStudy().then((raw) => {
    // Keep anything recorded before storage answered (e.g., a very fast first tap).
    const stored = normalizeStudy(raw);
    current = {
      cards: { ...stored.cards, ...current.cards },
      bookmarks: Array.from(new Set([...stored.bookmarks, ...current.bookmarks])),
    };
    loaded = true;
    listeners.forEach((fn) => fn(current));
  });
  return loading;
}

export const studyActions = {
  grade: (id, knewIt) => set(gradeCard(current, id, knewIt)),
  toggleBookmark: (topic) => set(toggle(current, topic)),
};

/** @returns {{ study: object, ready: boolean, grade: Function, toggleBookmark: Function }} */
export default function useStudy() {
  const [study, setStudy] = useState(current);
  const [ready, setReady] = useState(loaded);
  useEffect(() => {
    const fn = (s) => {
      setStudy(s);
      setReady(loaded);
    };
    listeners.add(fn);
    ensureLoaded();
    fn(current);
    return () => listeners.delete(fn);
  }, []);
  return { study, ready, grade: studyActions.grade, toggleBookmark: studyActions.toggleBookmark };
}
