import generate from 'project-name-generator';

import toTitleCase from '~helpers/toTitleCase';

/**
 * Returns a random name that consists of 2 alliterative words
 * and space between them.
 * @returns {string}
 */
export default function genRandomName() {
  return toTitleCase(generate({ words: 2 }).spaced);
}
