import {
  CardActionTypes,
  CardState,
  SHOW_WORDS,
  TOGGLE_SELECT,
  TOGGLE_WORD_CHECK,
} from "./type";

const cardState: CardState = {
  showWords: false,
  isSelectMode: false,
  currentCard: {
    id: "1",
    correct: 0,
    words: [
      {
        id: "1",
        correct: false,
        text: "test",
      },
      {
        id: "2",
        correct: false,
        text: "test",
      },
      {
        id: "3",
        correct: false,
        text: "test",
      },
      {
        id: "4",
        correct: false,
        text: "test",
      },
      {
        id: "5",
        correct: false,
        text: "test",
      },
    ],
  },
};

export const cardReducer = (
  state = cardState,
  action: CardActionTypes
): CardState => {
  switch (action.type) {
    case TOGGLE_WORD_CHECK:
      return {
        ...state,
        currentCard: {
          ...state.currentCard,
          words: [
            ...state.currentCard.words.slice(0, action.payload),
            {
              ...state.currentCard.words[action.payload],
              correct: !state.currentCard.words[action.payload].correct,
            },
            ...state.currentCard.words.slice(action.payload + 1),
          ],
        },
      };
    case SHOW_WORDS:
      return {
        ...state,
        showWords: true,
      };
    case TOGGLE_SELECT:
      return {
        ...state,
        isSelectMode: true,
      };
    default:
      return state;
  }
};
