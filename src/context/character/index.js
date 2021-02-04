import { useReducer, useCallback } from 'react';

import { characterReducer, initialCharacterState } from './reducer';
import { NAME, COLOR, BACKGROUND_COLOR, QUOTE, CLEAR } from './types';

import { quotes as TotalQuotes } from '../../assets/quotes/quotes.json';

const useCharacter = () => {
  const [characterState, dispatchCharacter] = useReducer(characterReducer, initialCharacterState);
  const clear = useCallback(() => dispatchCharacter({ type: CLEAR }), []);

  const setName = (name) => dispatchCharacter({ type: NAME, name });

  const setColor = (color) => dispatchCharacter({ type: COLOR, color });

  const setBackgroundColor = (backgroundColor) => dispatchCharacter({ type: BACKGROUND_COLOR, backgroundColor });

  const setQuote = useCallback(() => {
    let randomNumber = Math.floor(Math.random() * TotalQuotes.length + 1);
    let quote = TotalQuotes[randomNumber].quote;
    dispatchCharacter({ type: QUOTE, quote });
  }, []);

  return {
    name: characterState.name,
    color: characterState.color,
    backgroundColor: characterState.backgroundColor,
    quote: characterState.quote,
    clear,
    setName,
    setColor,
    setBackgroundColor,
    setQuote,
  };
};

export default useCharacter;
