import {
  connect,
  disconnect,
  send,
  WEBSOCKET_MESSAGE,
} from "@giantmachines/redux-websocket/dist";
import { Action } from "@giantmachines/redux-websocket/dist/types";
import { put, takeLatest } from "redux-saga/effects";
import {
  WS_CONNECT,
  WS_DISCONNECT,
  WS_DISCONNECTED,
  WS_RECEIVE_MESSAGE,
  WS_SEND_MESSAGE,
} from "../../store/websocket/actions";
import { SocketActions } from "../../store/websocket/types";

export function* socketWatcher() {
  console.log("socket watcher");
  yield takeLatest(WS_CONNECT, connectSocketFlow);
  yield takeLatest(WS_DISCONNECT, connectSocketFlow);
  yield takeLatest(WS_SEND_MESSAGE, connectSocketFlow);
  yield takeLatest(WS_RECEIVE_MESSAGE, connectSocketMessageFlow);
}

function* connectSocketFlow(action: SocketActions) {
  switch (action.type) {
    case WS_CONNECT:
      console.log("connecting to :", action.payload.host);
      yield put(connect(action.payload.host));
      let msg = {
        type: "ADD_PLAYER_ROOM",
      };
      yield put(send({ message: {} }));
      break;
    case WS_DISCONNECT:
      console.log("disconnecting");
      yield put(disconnect());
      break;
    case WS_SEND_MESSAGE:
      console.log("sending message", action.payload);
      yield put(send({ type: action.payload.type, body: action.payload.body }));
      break;
  }
}

function* connectSocketMessageFlow(action: SocketActions) {
  switch (action.type) {
    case WS_RECEIVE_MESSAGE:
      console.log("received message: ", action.payload);
      break;
  }
}
