import { fork } from "redux-saga/effects";
import { addTeamPlayerWatcher } from "./player/addTeamPlayerSaga";
import { setActivePlayerWatcher } from "./player/setActivePlayerSaga";
import { startTimerWatcher } from "./timer/timerSaga";

export function* rootSaga() {
  yield fork(startTimerWatcher);
  yield fork(setActivePlayerWatcher);
  yield fork(addTeamPlayerWatcher);
}
