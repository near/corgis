import randomColor from 'randomcolor';

import { genRandomName } from '~helpers/generators';
import { getRandomQuoteId } from '~helpers/quotes';

import { NAME, QUOTE, COLOR, BACKGROUND_COLOR, CLEAR } from './types';

export const initialCharacterState = {
  name: genRandomName(),
  quote: getRandomQuoteId(),
  color: randomColor(),
  backgroundColor: randomColor(),
};

export const characterReducer = (currentState = initialCharacterState, action) => {
  switch (action.type) {
    case NAME:
      return {
        ...currentState,
        name: action.name,
      };

    case QUOTE:
      return {
        ...currentState,
        quote: action.quote,
      };

    case COLOR:
      return {
        ...currentState,
        color: action.color,
      };

    case BACKGROUND_COLOR:
      return {
        ...currentState,
        backgroundColor: action.backgroundColor,
      };

    case CLEAR:
      return initialCharacterState;

    default:
      throw new Error('Should not come here, something is wrong!');
  }
};
