import { useReducer, useCallback } from "react";
import Quotes from "../assets/quotes/quotes.json";
const randomColor = require("randomcolor");
const generate = require("project-name-generator");

const TotalQuotes = Quotes.quotes;

const initialState = {
  name: generate({ words: 2, alliterative: true }).spaced,
  quote: null,
  color: randomColor(),
  backgroundColor: randomColor(),
};

const characterReducer = (currentState, action) => {
  switch (action.type) {
    case "NAME":
      return {
        ...currentState,
        name: action.name,
      };
    case "QUOTE":
      return {
        ...currentState,
        quote: action.quote,
      };
    case "COLOR":
      return {
        ...currentState,
        color: action.color,
      };
    case "BACKGROUND_COLOR":
      return {
        ...currentState,
        backgroundColor: action.backgroundColor,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useCharacter = () => {
  const [characterState, dispatchCharacter] = useReducer(
    characterReducer,
    initialState
  );
  const clear = useCallback(() => dispatchCharacter({ type: "CLEAR" }), []);

  const setName = useCallback(
    (name) => dispatchCharacter({ type: "NAME", name }),
    []
  );

  const setColor = useCallback(
    (color) => dispatchCharacter({ type: "COLOR", color }),
    []
  );

  const setBackgroundColor = useCallback(
    (backgroundColor) =>
      dispatchCharacter({ type: "BACKGROUND_COLOR", backgroundColor }),
    []
  );

  const setQuote = useCallback(() => {
    let randomNumber = Math.floor(Math.random() * TotalQuotes.length + 1);
    let quote = TotalQuotes[randomNumber].quote;
    dispatchCharacter({ type: "QUOTE", quote });
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
