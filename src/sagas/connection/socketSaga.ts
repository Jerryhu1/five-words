import {
  connect,
  disconnect,
  send,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_SEND,
} from "@giantmachines/redux-websocket/dist";
import {Action} from "@giantmachines/redux-websocket/dist/types";
import {put, takeLatest, takeEvery} from "redux-saga/effects";
import {SET_ROOM} from "../../store/room/types";
import {SET_SESSION, WS_RECEIVE_MESSAGE} from "../../store/websocket/actions";
import {SET_ACTIVE_PLAYER_ID} from "../../store/player/types";
import {START_TIMER, SET_TIMER} from "../../store/timer/types";

export function* socketWatcher() {
  yield takeLatest([
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_SEND], connectSocketFlow);
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
      yield put(send({type: action.payload.type, body: action.payload.body}));
      break;
  }
}

function* connectSocketMessageFlow(action: Action) {
  switch (action.type) {
    case WS_RECEIVE_MESSAGE:
      const message = JSON.parse(action.payload.message)
      switch (message.type) {
        case "CLIENT_REGISTERED":
          yield put({type: SET_SESSION, payload: {sessionID: message.body}})
          yield put({type: SET_ACTIVE_PLAYER_ID, payload: {id: message.body}})
          break;
        case SET_ROOM:
          yield put({
            type: SET_ROOM, payload: {
              newState: {
                ...message.body,
              }
            }
          })
          break;
        case START_TIMER:
          yield put({
            type: START_TIMER,
            payload: {
              ...message.body
            }
          })
          break;
        case SET_TIMER:
          yield put({
            type: SET_TIMER,
            payload: {
              ...message.body
            }
          })
          break;
      }
      break;
  }
}
