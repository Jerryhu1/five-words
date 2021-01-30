import { fork } from "redux-saga/effects";
import { socketWatcher } from "./connection/socketSaga";
import { addTeamPlayerWatcher } from "./player/addTeamPlayerSaga";
import { setActivePlayerWatcher } from "./player/setActivePlayerSaga";
import { roomWatcher } from "./room/createRoomSaga";
import { startTimerWatcher } from "./timer/timerSaga";

export function* rootSaga() {
  yield fork(startTimerWatcher);
  yield fork(setActivePlayerWatcher);
  yield fork(addTeamPlayerWatcher);
  yield fork(socketWatcher);
  yield fork(roomWatcher);
}
