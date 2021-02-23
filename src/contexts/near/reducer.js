import { CLEAR_STATE, LOADING_START, LOADING_SUCCESS, SET_USER } from './types';

export const initialNearState = {
  user: null,
  isLoading: true,
};

export const nearReducer = (currentState = initialNearState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...currentState,
        user: action.payload.user,
      };

    case LOADING_START:
      return {
        ...currentState,
        isLoading: true,
      };

    case LOADING_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
      };

    case CLEAR_STATE:
      return initialNearState;

    default:
      throw new Error('Unexpected action...');
  }
};
