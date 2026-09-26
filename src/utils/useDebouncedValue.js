import { useEffect, useState } from 'react';

// Returns `value` once it has stopped changing for `delay` ms, so expensive filters
// (thousands of screens / glossary terms) run once per pause instead of once per keystroke.
export default function useDebouncedValue(value, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    if (value === debounced) return undefined;
    // Clearing a search should feel instant.
    if (!value) {
      setDebounced(value);
      return undefined;
    }
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay, debounced]);
  return debounced;
}
