import { genRandomColor, genRandomName } from '~helpers/generators';
import { getRandomQuoteId } from '~helpers/quotes';

/**
 * Generates random character for CharacterContext.
 *
 * Each Corgi in CharacterContext has the next structure:
 * @typedef {Object} Character
 * @property {string} name // Corgi name
 * @property {string} quote // quote ID
 * @property {string} color // HEX string
 * @property {string} backgroundColor // HEX string
 *
 * Returns Character object.
 * @returns {Character}
 */
export default function genRandomCharacter() {
  return {
    name: genRandomName(),
    quote: getRandomQuoteId(),
    color: genRandomColor(),
    backgroundColor: genRandomColor(),
  };
}
