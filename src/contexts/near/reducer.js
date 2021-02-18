import { SET_USER, CLEAR_STATE } from './types';

export const initialNearState = {
  user: null,
};

export const nearReducer = (currentState = initialNearState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.payload.user,
      };

    case CLEAR_STATE:
      return initialNearState;

    default:
      throw new Error('Unexpected action...');
  }
};
