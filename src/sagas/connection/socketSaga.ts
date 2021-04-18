import {
  connect,
  disconnect,
  send,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT, WEBSOCKET_MESSAGE,
  WEBSOCKET_SEND,
} from "@giantmachines/redux-websocket/dist";
import {Action} from "@giantmachines/redux-websocket/dist/types";
import {put, takeLatest, takeEvery} from "redux-saga/effects";
import {SET_ROOM} from "../../store/room/types";
import {SET_SESSION, WS_RECEIVE_MESSAGE, WS_SEND_MESSAGE} from "../../store/websocket/actions";

export function* socketWatcher() {
  yield takeLatest(WEBSOCKET_CONNECT, connectSocketFlow);
  yield takeLatest(WEBSOCKET_DISCONNECT, connectSocketFlow);
  yield takeLatest(WEBSOCKET_SEND, connectSocketFlow);
  yield takeEvery(WS_RECEIVE_MESSAGE, connectSocketMessageFlow);
}

function* connectSocketFlow(action: Action) {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      yield put(connect(action.payload.host));
      break;
    case WEBSOCKET_DISCONNECT:
      yield put(disconnect());
      break;
    case WEBSOCKET_SEND:
      yield put(send({ type: action.payload.type, body: action.payload.body }));
      break;
  }
}

function* connectSocketMessageFlow(action: Action) {
  switch (action.type) {
    case WS_RECEIVE_MESSAGE:
      const message = JSON.parse(action.payload.message)
      switch (message.type) {
        case "CLIENT_REGISTERED":
          yield put({type: SET_SESSION, payload: { sessionID: message.body}})
          break;
        case "SET_ROOM":
          yield put({type: SET_ROOM, payload: { newState: message.body} } )
          break;
      }
      break;
  }
}
