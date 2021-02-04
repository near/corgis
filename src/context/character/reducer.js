import randomColor from 'randomcolor';
import generate from 'project-name-generator';

export const initialCharacterState = {
  name: generate({ words: 2, alliterative: true }).spaced,
  quote: null,
  color: randomColor(),
  backgroundColor: randomColor(),
};

export const characterReducer = (currentState = initialCharacterState, action) => {
  switch (action.type) {
    case 'NAME':
      return {
        ...currentState,
        name: action.name,
      };
    case 'QUOTE':
      return {
        ...currentState,
        quote: action.quote,
      };
    case 'COLOR':
      return {
        ...currentState,
        color: action.color,
      };
    case 'BACKGROUND_COLOR':
      return {
        ...currentState,
        backgroundColor: action.backgroundColor,
      };
    case 'CLEAR':
      return initialCharacterState;
    default:
      throw new Error('Should not come here, something is wrong!');
  }
};
