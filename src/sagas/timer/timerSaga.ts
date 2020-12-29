import { put, takeLatest } from "redux-saga/effects";
import { SHOW_WORDS } from "../../store/card/type";
import { START_TIMER, TimerActionTypes } from "../../store/timer/type";

// When TIMER_START executes
// Run a saga that dispatches an increment action each second
// If the time = 0, then stop

export function* startTimerWatcher() {
  yield takeLatest(START_TIMER, startTimerFlow);
}

function* startTimerFlow(action: TimerActionTypes) {
  if (action.type === START_TIMER) {
    yield put({ type: SHOW_WORDS });
  }
}
