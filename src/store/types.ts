import { CardActionTypes } from "./card/type";
import { GameActionTypes } from "./player/types";
import { TimerActionTypes } from "./timer/type";

export type AppActions = GameActionTypes | TimerActionTypes | CardActionTypes;
