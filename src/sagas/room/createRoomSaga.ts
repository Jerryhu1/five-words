import {AxiosResponse} from "axios";
import {call, put, takeLatest} from "redux-saga/effects";
import RoomClient from "../../client/room";
import {FETCH_ACTIVE_PLAYER} from "../../store/player/types";
import {RoomActionTypes} from "../../store/room/reducers";
import {ADD_PLAYER_TO_ROOM, CREATE_ROOM, GET_ROOM, SET_ROOM, START_GAME,} from "../../store/room/types";
import {WEBSOCKET_SEND} from "@giantmachines/redux-websocket/dist";

export function* roomWatcher() {
  yield takeLatest(
    [CREATE_ROOM, ADD_PLAYER_TO_ROOM, GET_ROOM, FETCH_ACTIVE_PLAYER, START_GAME],
    roomFlow
  );
}

function* roomFlow(action: RoomActionTypes) {
  // If create room -> Do sychronous http call to server to create room
  // Then synchronous http call to server to add player to that room
  switch (action.type) {
    case GET_ROOM:
      const response: AxiosResponse = yield call(
        RoomClient.getRoom,
        action.payload.roomName
      );
      yield put({ type: SET_ROOM, payload: { newState: response.data } });
      break;
    case ADD_PLAYER_TO_ROOM:
      try {
        yield put({
          type: WEBSOCKET_SEND,
          payload: {
            type: "ADD_PLAYER_TO_ROOM",
            body: action.payload,
          },
        });
      } catch (err) {
        console.log(err);
      }
      break;
    case START_GAME:
      try {
        yield put({
          type: WEBSOCKET_SEND,
          payload: {
            type: "START_GAME",
            body: action.payload,
          },
        });
      } catch (err) {
        console.log(err);
      }
      break;
  }
}
