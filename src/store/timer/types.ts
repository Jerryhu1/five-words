export const START_TIMER = "START_TIMER"
export const SET_TIMER = "SET_TIMER"

export interface TimerState {
  time: number;
  maxTime: number;
  started: boolean;
}


