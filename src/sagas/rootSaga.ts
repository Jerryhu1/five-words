import { fork } from "redux-saga/effects";
import { startTimerWatcher } from "./timer/timerSaga";

export function* rootSaga() {
  yield fork(startTimerWatcher);
}
