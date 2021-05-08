import { CardActionTypes } from "./card/type";
import { PlayerActionTypes } from "./player/reducers";
import { TimerActionTypes } from "./timer/types";

export type AppActions = PlayerActionTypes | TimerActionTypes | CardActionTypes;
