import { quotes } from '../../assets/quotes/quotes.json';

export default function genRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)].quote;
}
