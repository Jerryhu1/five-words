import { START_TIMER, TICK_TIMER, TimerActionTypes, TimerState } from "./type";

const timerState: TimerState = {
  time: 10,
  maxTime: 10,
  started: false,
};

export const timerReducer = (
  state = timerState,
  action: TimerActionTypes
): TimerState => {
  switch (action.type) {
    case START_TIMER:
      return {
        ...state,
        started: true,
      };
    case TICK_TIMER:
      return {
        ...state,
        time: state.time - 1,
      };
    default:
      return state;
  }
};
