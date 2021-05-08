import {ActionType, getType} from "typesafe-actions";
import * as actions from "./actions";
import {TimerState} from "./types";

const timerState: TimerState = {
  time: 10,
  maxTime: 10,
  started: false,
};

export type TimerActionTypes = ActionType<typeof actions>

export const timerReducer = (
  state = timerState,
  action: TimerActionTypes
): TimerState => {
  switch (action.type) {
    case getType(actions.startTimer):
      return {
        ...state,
        started: true,
        maxTime: action.payload.maxTime
      };
    case getType(actions.setTimer):
      return {
        ...state,
        time: action.payload.newTime
      };
    default:
      return state;
  }
};
