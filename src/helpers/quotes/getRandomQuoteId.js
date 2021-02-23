import { quotes } from '~assets/quotes/quotes';

/**
 * Returns a valid random number id
 * @returns {number}
 */
export default function getRandomQuoteId() {
  return Math.floor(Math.random() * quotes.length).toString();
}
