import { quotes } from '~assets/quotes/quotes';

import { getRandomQuoteId } from '~helpers/quotes';

/**
 * For simplicity, indexes are used instead of unique id.
 * @param {string} id
 *
 * Each quote in JSON has the next structure:
 * @typedef {Object} Quote
 * @property {string} quote
 * @property {string} author
 *
 * Returns Quote object
 * @returns {Quote}
 */
export default function getQuoteById(id) {
  return quotes[Number(id)] || quotes[getRandomQuoteId()];
}
