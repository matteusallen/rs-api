/**
 * Makes first character upper case.
 *
 * @param {String} s
 * @returns {String} new string, does not mutate
 */
export function upperFirst(s) {
  if (!s) return s;

  return s.trim().replace(/^[a-z]/, char => char.toUpperCase());
}

/**
 * Formats a string to title case.
 *
 * @param {String} s
 * @returns {String} new string, does not mutate
 */
export function startCase(s) {
  if (!s) return s;

  const words = s.trim().split(/\s+/);
  const spaces = s
    .trim()
    .split(/[^\s+]/)
    .filter(v => !!v)
    .map(() => ' ');
  words.forEach((word, index) => {
    const nonAlphanumericStripped = word.replace(/[^a-z0-9]/gi, '');
    const alphanumericSpaceSeparated = nonAlphanumericStripped.replace(/\d+/g, digits => ` ${digits} `).trim();
    const camelCaseSpaceSeparated = alphanumericSpaceSeparated.replace(/[A-Z]/g, s => ` ${s}`).trim();
    words[index] = camelCaseSpaceSeparated.split(' ').map(upperFirst).join(' ');
  });

  const weave = (a, b) => {
    const weaved = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== undefined) weaved.push(a[i]);
      if (b[i] !== undefined) weaved.push(b[i]);
    }
    return weaved;
  };

  return weave(words, spaces).join('');
}

export default {
  upperFirst,
  startCase
};
