const generate = require('project-name-generator');

/**
 * Returns a random name that consists of 2 alliterative words
 * and space between them.
 * @returns {string}
 */
export default function genRandomName() {
  return generate({ words: 2, alliterative: true }).spaced;
}
