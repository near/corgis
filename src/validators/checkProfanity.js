import Filter from 'bad-words';

const badWordsFilter = new Filter();

const removeWords = [
  'blood',
  'bloody',
  'God',
  'god-dam',
  'god-damned',
  'goddamn',
  'goddamned',
  'hell',
  'hells',
  'hoar',
  'knob',
  'pawn',
  'sadist',
];

badWordsFilter.removeWords(...removeWords);

export default function checkProfanity(str) {
  return badWordsFilter.isProfane(str);
}
