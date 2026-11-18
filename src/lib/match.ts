/**
 * Whether a text names a longer word instead of the place.
 *
 * The API's `q` matches inside words, so "Taytay" also finds "Taytayan" and
 * "Puntataytay", which are other places. A row is ruled out when a word of `q`
 * is in its text but never as a whole word: a letter or digit on either side
 * makes it part of a longer one. Case and accents do not count ("Los Banos"
 * is in "Los Baños").
 *
 * A word that is nowhere in the text rules nothing out: the API also searches
 * fields it does not return (a health facility's province).
 *
 * Pure: the scripts import it under Node.
 */

const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** True when some word of `q` is in `texts` only as part of longer words. */
export function onlyInsideWords(q: string, ...texts: (string | null | undefined)[]): boolean {
  const text = fold(texts.filter(Boolean).join('\n'));
  return fold(q)
    .split(/\s+/)
    .filter(Boolean)
    .some((word) => {
      const whole = new RegExp(`(?<![\\p{L}\\p{N}])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u');
      return text.includes(word) && !whole.test(text);
    });
}
