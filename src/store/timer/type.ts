export const START_TIMER = "START_TIMER";
export const TICK_TIMER = "TICK_TIMER";

export interface TimerState {
  time: number;
  maxTime: number;
  started: boolean;
}

interface StartTimerAction {
  type: typeof START_TIMER;
}

interface TickTimerAction {
  type: typeof TICK_TIMER;
}

export type TimerActionTypes = StartTimerAction | TickTimerAction;
