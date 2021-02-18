import randomColor from 'randomcolor';

import { genRandomName } from '~helpers/generators';
import { getRandomQuoteId } from '~helpers/quotes';

import { SET_NAME, SET_COLOR, SET_BACKGROUND_COLOR, SET_QUOTE, CLEAR_STATE } from './types';

export const initialCharacterState = {
  name: genRandomName(),
  quote: getRandomQuoteId(),
  color: randomColor(),
  backgroundColor: randomColor(),
};

export const characterReducer = (currentState = initialCharacterState, action) => {
  switch (action.type) {
    case SET_NAME:
      return {
        ...currentState,
        name: action.payload.name,
      };

    case SET_QUOTE:
      return {
        ...currentState,
        quote: action.payload.quote,
      };

    case SET_COLOR:
      return {
        ...currentState,
        color: action.payload.color,
      };

    case SET_BACKGROUND_COLOR:
      return {
        ...currentState,
        backgroundColor: action.payload.backgroundColor,
      };

    case CLEAR_STATE:
      return initialCharacterState;

    default:
      throw new Error('Should not come here, something is wrong!');
  }
};
