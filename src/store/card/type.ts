import {Card} from "../../types/card";

export interface CardState {
  currentCard: Card;
  showWords: boolean;
  isSelectMode: boolean;
}

export const SET_CARD = "SET_CARD";
export const LOAD_CARD = "LOAD_CARDS";
export const TOGGLE_WORD_CHECK = "TOGGLE_WORD_CHECK";
export const UNCHECK_WORD = "UNCHECK_WORD";
export const SUBMIT_CARD = "SUBMIT_CARD";
export const SHOW_WORDS = "SHOW_WORDS";
export const HIDE_CARD = "HIDE_CARD";
export const TOGGLE_SELECT = "TOGGLE_SELECT";

interface LoadCardAction {
  type: typeof LOAD_CARD;
}

interface ToggleWordCheckAction {
  type: typeof TOGGLE_WORD_CHECK;
  payload: number;
}

interface SubmitCardAction {
  type: typeof SUBMIT_CARD;
}

interface SetCardAction {
  type: typeof SET_CARD;
  payload: number;
}

interface HideCardAction {
  type: typeof HIDE_CARD;
}

interface ShowWordsAction {
  type: typeof SHOW_WORDS;
}
interface ToggleSelectAction {
  type: typeof TOGGLE_SELECT;
}
export type CardActionTypes =
  | LoadCardAction
  | ToggleWordCheckAction
  | SubmitCardAction
  | SetCardAction
  | HideCardAction
  | ShowWordsAction
  | ToggleSelectAction;
