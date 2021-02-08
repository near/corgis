const generate = require('project-name-generator');

export default function genRandomName() {
  return generate({ words: 2, alliterative: true }).spaced;
}
