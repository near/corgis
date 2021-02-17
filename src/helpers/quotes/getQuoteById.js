import { quotes } from '~assets/quotes/quotes';

import { getRandomQuoteId } from '~helpers/quotes';

/**
 * for simplicity, indexes are used instead of unique id
 * @param {string} id
 */
export default function getQuoteById(id) {
  const { quote } = quotes[id] || quotes[getRandomQuoteId()];
  return quote;
}
