import { fork } from "redux-saga/effects";
import { socketWatcher } from "./connection/socketSaga";
import { addTeamPlayerWatcher } from "./player/addTeamPlayerSaga";
import { roomWatcher } from "./room/roomSaga";
import { chatWatcher } from "./chat/chatSaga";

export function* rootSaga() {
  yield fork(addTeamPlayerWatcher);
  yield fork(socketWatcher);
  yield fork(roomWatcher);
  yield fork(chatWatcher);
}
