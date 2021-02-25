/**
 * Takes string and returns string in TitleCase.
 * Handles only spaced string.
 * @param {string} str
 * @returns {string}
 */
export default function toTitleCase(str) {
  return typeof str === 'string' && str.length
    ? str
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : str;
}
