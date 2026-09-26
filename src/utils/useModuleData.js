import { useEffect, useState } from 'react';
import { getScreenEntry } from './screenIndex';
import { getLoadedScreen, isModuleLoaded, loadModule } from '../data/moduleLoader';

/**
 * Full detail for one catalog screen, loading its module on first use.
 * The lightweight index entry (name, nav, module, category, authority) is available at once,
 * so callers can render a header while the module chunk streams in.
 * @returns {{ entry: object|null, screen: object|null, loading: boolean, error: Error|null, retry: () => void }}
 */
export function useScreenDetail(screenId) {
  const entry = screenId ? getScreenEntry(screenId) : null;
  const moduleId = entry ? entry.moduleId : null;
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [, setLoadedTick] = useState(0);

  useEffect(() => {
    if (!moduleId || isModuleLoaded(moduleId)) return undefined;
    let alive = true;
    setError(null);
    loadModule(moduleId)
      .then(() => alive && setLoadedTick((n) => n + 1))
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [moduleId, attempt]);

  const screen = moduleId ? getLoadedScreen(moduleId, screenId) : null;
  return {
    entry,
    screen,
    loading: Boolean(entry && !screen && !error),
    error: screen ? null : error,
    retry: () => setAttempt((n) => n + 1),
  };
}
