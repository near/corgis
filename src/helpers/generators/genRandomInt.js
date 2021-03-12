/* eslint-disable no-param-reassign */

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min and no greater than max.
 *
 * @param {number} min
 * @param {number} max
 *
 * @returns {number}
 */
export default function genRandomInt(min = 0, max = 1) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
