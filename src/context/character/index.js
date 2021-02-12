import React, { useCallback, useEffect, useReducer } from 'react';

import { genRandomQuote } from '~helpers/generators';

import { characterReducer, initialCharacterState } from './reducer';
import { NAME, COLOR, BACKGROUND_COLOR, QUOTE, CLEAR } from './types';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

export const CharacterContext = React.createContext(initialCharacterState);

const CharacterContextProviderPropTypes = { children: ReactChildrenTypeRequired };

export const CharacterContextProvider = ({ children }) => {
  const [characterState, dispatchCharacter] = useReducer(characterReducer, initialCharacterState);

  const clear = () => dispatchCharacter({ type: CLEAR });

  const setName = (name) => dispatchCharacter({ type: NAME, name });

  const setColor = (color) => dispatchCharacter({ type: COLOR, color });

  const setBackgroundColor = (backgroundColor) => dispatchCharacter({ type: BACKGROUND_COLOR, backgroundColor });

  const generateQuote = useCallback(() => {
    dispatchCharacter({ type: QUOTE, quote: genRandomQuote() });
  }, []);

  useEffect(() => {
    generateQuote();
  }, [generateQuote, characterState.name]);

  const value = {
    name: characterState.name,
    color: characterState.color,
    backgroundColor: characterState.backgroundColor,
    quote: characterState.quote,
    clear,
    setName,
    setColor,
    setBackgroundColor,
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

CharacterContextProvider.propTypes = CharacterContextProviderPropTypes;
