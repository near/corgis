import { quotes } from '~assets/quotes/quotes';

export default function getRandomQuoteId() {
  return Math.floor(Math.random() * quotes.length).toString();
}
