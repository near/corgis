import humanizeDuration from 'humanize-duration';

/**
 * In JavaScript Date milliseconds are limited by 13 nums.
 * The only way to correctly calculate the date is to cut redundunt or add missing nums.
 * 
 * This function calculates how much time passed from the given timestamp.
 *
 * The following parameter is a timestamp in ms.
 * @param {(string | number)} ms
 *
 * Returns the parsed and humanized time in string representation.
 * @returns {string}
 */
export default function humanizeTime(ms) {
  const milliseconds = Number(
    (() => {
      let msStr = ms.toString();
      if (msStr.length > 13) {
        return msStr.slice(0, 13);
      } else if (msStr.length < 13) {
        for (let i = msStr.length; i < 13; i++) {
          msStr += '0';
        }
        return msStr;
      } else {
        return msStr;
      }
    })(),
  );

  return (
    humanizeDuration(Date.now() - milliseconds, {
      round: true,
      largest: 1,
    }) || '0 seconds'
  );
}
