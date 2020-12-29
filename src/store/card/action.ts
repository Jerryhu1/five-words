import {
  CardActionTypes,
  LOAD_CARD,
  SHOW_WORDS,
  TOGGLE_SELECT,
  TOGGLE_WORD_CHECK,
} from "./type";

export const toggleWordCheck = (index: number): CardActionTypes => ({
  type: TOGGLE_WORD_CHECK,
  payload: index,
});

export const showWords = (): CardActionTypes => ({
  type: SHOW_WORDS,
});

export const toggleSelect = (): CardActionTypes => ({
  type: TOGGLE_SELECT,
});

export const loadCards = (): CardActionTypes => ({
  type: LOAD_CARD,
});
