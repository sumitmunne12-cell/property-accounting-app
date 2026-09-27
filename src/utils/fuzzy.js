// Shared text normalization and bounded edit distance for the screen search and the GAAP Codex.
// Pure JS (no React Native imports) so it can be unit-tested in Node.

// "A/P Invoice" -> "ap invoice", "G/L" -> "gl", "1099-NEC" -> "1099 nec"
export const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/(\w)\/(\w)/g, '$1$2')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Bounded Levenshtein: returns max+1 as soon as the distance must exceed `max`.
export function editDistance(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
