import { START_TIMER, TICK_TIMER, TimerActionTypes } from "./type";

export const startTimer = (): TimerActionTypes => ({
  type: START_TIMER,
});

export const tickTimer = (): TimerActionTypes => ({
  type: TICK_TIMER,
});
