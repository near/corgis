import humanizeDuration from 'humanize-duration';

import { formatToMs } from '~helpers/time';

const shortHumanizer = humanizeDuration.humanizer({
  language: 'short',
  languages: {
    short: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
});

/**
 * @typedef {Set<'y' | 'mo' | 'w' | 'd' | 'h' | 'm' | 's' | 'ms'>} UnitsArray
 *
 * @typedef {Object} Options
 * @property {number} [largest] - Number of units to display. The default is 1.
 * @property {boolean} [round] - Use true to round the smallest unit displayed. The default is true.
 * @property {string} [spacer] - String between each unit. The default is ' '.
 * @property {string} [delimiter] - String to display between the previous unit and the next value. The default is ', '.
 * @property {number} [maxDecimalPoints] - Number that defines a maximal decimal points for float values. The default is 0.
 * @property {UnitsArray} [units] - Use true to round the smallest unit displayed. The default is true.
 * @property {boolean} [short] - Use abbreviation if true. The default is false.
 */

/**
 * There are no nanoseconds in JavaScript, so the max timestamp length is 13.
 * The only way to correctly calculate the date is to cut redundunt or add missing nums.
 *
 * This function calculates how much time passed from the given timestamp.
 *
 * @param {(string | number)} timestamp - String or number which will be converted to ms.
 *
 * @param {Options} options - Object with options.
 *
 * @returns {string} - Returns the parsed and humanized time in string representation.
 */

const defaultOptions = {
  largest: 1,
  round: true,
  spacer: ' ',
  delimiter: ', ',
  units: ['h', 'm', 's'],
  maxDecimalPoints: 0,
  short: false,
};

export default function humanizeTime(timestamp, options = defaultOptions) {
  const milliseconds = formatToMs(timestamp);

  const humanizer = options.short ? shortHumanizer : humanizeDuration;

  return (
    humanizer(Date.now() - milliseconds, {
      ...defaultOptions,
      ...options,
    }) || '0 seconds'
  );
}
