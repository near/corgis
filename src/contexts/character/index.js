import React, { useCallback, useEffect, useReducer } from 'react';

import { getRandomQuoteId } from '~helpers/quotes';

import { characterReducer, initialCharacterState } from './reducer';
import { SET_CHARACTER, SET_NAME, SET_COLOR, SET_BACKGROUND_COLOR, SET_QUOTE, CLEAR_STATE } from './types';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';
import genRandomCharacter from '~helpers/generators/genRandomCharacter';

export const CharacterContext = React.createContext(initialCharacterState);

const CharacterContextProviderPropTypes = { children: ReactChildrenTypeRequired };

export const CharacterContextProvider = ({ children }) => {
  const [characterState, dispatchCharacter] = useReducer(characterReducer, initialCharacterState);

  const clearState = () => {
    dispatchCharacter({ type: CLEAR_STATE });
  };

  const setName = (name) => {
    dispatchCharacter({ type: SET_NAME, payload: { name } });
  };

  const setColor = (color) => {
    dispatchCharacter({ type: SET_COLOR, payload: { color } });
  };

  const setBackgroundColor = (backgroundColor) => {
    dispatchCharacter({ type: SET_BACKGROUND_COLOR, payload: { backgroundColor } });
  };

  const generateQuote = useCallback(() => {
    dispatchCharacter({ type: SET_QUOTE, payload: { quote: getRandomQuoteId() } });
  }, []);

  const generateRandomCharacter = () => {
    dispatchCharacter({ type: SET_CHARACTER, payload: { character: genRandomCharacter() } });
  };

  useEffect(() => {
    generateQuote();
  }, [generateQuote, characterState.name]);

  const value = {
    name: characterState.name,
    color: characterState.color,
    backgroundColor: characterState.backgroundColor,
    quote: characterState.quote,
    clearState,
    setName,
    setColor,
    setBackgroundColor,
    generateRandomCharacter,
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

CharacterContextProvider.propTypes = CharacterContextProviderPropTypes;
