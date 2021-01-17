import { connect, disconnect, send } from "@giantmachines/redux-websocket/dist";
import { Action } from "@giantmachines/redux-websocket/dist/types";
import { put, takeLatest } from "redux-saga/effects";
import {
  WS_CONNECT,
  WS_DISCONNECT,
  WS_NEW_MESSAGE,
} from "../../store/websocket/actions";
import { SocketActions } from "../../store/websocket/types";

export function* socketWatcher() {
  console.log("socket watcher");
  yield takeLatest(WS_CONNECT, connectSocketFlow);
  yield takeLatest(WS_DISCONNECT, connectSocketFlow);
  yield takeLatest(WS_NEW_MESSAGE, connectSocketFlow);
  yield takeLatest("MESSAGE", connectSocketMessageFlow);
}

function* connectSocketFlow(action: SocketActions) {
  switch (action.type) {
    case WS_CONNECT:
      console.log("connecting to :", action.payload.host);
      yield put(connect(action.payload.host));
      break;
    case WS_DISCONNECT:
      console.log("disconnecting");
      yield put(disconnect());
      break;
    case WS_NEW_MESSAGE:
      console.log("sending message", action.payload.message);
      yield put(send({ message: action.payload.message }));
      break;
  }
}

function* connectSocketMessageFlow(action: Action) {
  switch (action.type) {
    case "MESSAGE":
      console.log("received message: ", action.payload);
      break;
  }
}
