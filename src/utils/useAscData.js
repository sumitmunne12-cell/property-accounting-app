import { useEffect, useState } from 'react';
import { getAscEntry } from './ascIndex';
import { getLoadedCard, getLoadedText, isSeriesLoaded, isTextLoaded, loadCard, loadText } from '../data/asc/ascLoader';

/**
 * Master card for one ASC Topic, loading its FASB series file on first use.
 * The index entry (number, title, tagline, series) is available at once so callers can render a
 * header while the series chunk streams in.
 * @returns {{ entry: object|null, card: object|null, loading: boolean, error: Error|null, retry: () => void }}
 */
export function useAscCard(topic) {
  const entry = topic ? getAscEntry(topic) : null;
  const series = entry ? entry.series : null;
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [, setLoadedTick] = useState(0);

  useEffect(() => {
    if (!entry || isSeriesLoaded(series)) return undefined;
    let alive = true;
    setError(null);
    loadCard(entry.topic)
      .then(() => alive && setLoadedTick((n) => n + 1))
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [entry, series, attempt]);

  const card = entry ? getLoadedCard(entry.topic) : null;
  return {
    entry,
    card,
    loading: Boolean(entry && !card && !error),
    error: card ? null : error,
    retry: () => setAttempt((n) => n + 1),
  };
}

/**
 * Complete official Codification text for one Topic, loaded only while `enabled` (the Official
 * Text tab is open) — the largest Topics are 1–1.7 MB.
 */
export function useAscText(topic, enabled = true) {
  const t = topic ? String(topic) : null;
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [, setLoadedTick] = useState(0);

  useEffect(() => {
    if (!t || !enabled || isTextLoaded(t)) return undefined;
    let alive = true;
    setError(null);
    loadText(t)
      .then(() => alive && setLoadedTick((n) => n + 1))
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [t, enabled, attempt]);

  const text = t ? getLoadedText(t) : null;
  return {
    text,
    loading: Boolean(t && enabled && !text && !error),
    error: text ? null : error,
    retry: () => setAttempt((n) => n + 1),
  };
}
