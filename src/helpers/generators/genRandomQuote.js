import { quotes } from '~assets/quotes/quotes';

export default function genRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)].quote;
}
