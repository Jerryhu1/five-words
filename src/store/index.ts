import { combineReducers } from "redux";
import { cardReducer } from "./card/reducer";
import { playerReducer } from "./player/reducers";
import { timerReducer } from "./timer/reducer";

export const rootReducer = combineReducers({
  game: playerReducer,
  card: cardReducer,
  timer: timerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
