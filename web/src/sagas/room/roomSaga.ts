import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import RoomClient from "../../client/room";
import { FETCH_ACTIVE_PLAYER } from "../../store/player/types";
import { RoomActionTypes } from "../../store/room/reducers";
import {
  ADD_PLAYER_TO_ROOM,
  CREATE_ROOM,
  GET_ROOM,
  SET_ROOM,
  START_GAME,
  START_ROUND,
} from "../../store/room/types";
import { WEBSOCKET_SEND } from "@giantmachines/redux-websocket/dist";
import { getType } from "typesafe-actions";
import * as actions from "../../store/room/actions";

export function* roomWatcher() {
  yield takeLatest(
    [
      CREATE_ROOM,
      ADD_PLAYER_TO_ROOM,
      GET_ROOM,
      FETCH_ACTIVE_PLAYER,
      START_GAME,
      START_ROUND,
    ],
    roomFlow
  );
}

function* roomFlow(action: RoomActionTypes) {
  switch (action.type) {
    case getType(actions.getRoom):
      // If create room -> Do sychronous http call to server to create room
      // Then synchronous http call to server to add player to that room
      const response: AxiosResponse = yield call(
        RoomClient.getRoom,
        action.payload.roomName
      );
      yield put({ type: SET_ROOM, payload: { newState: response.data } });
      break;
    default:
      try {
        yield put({
          type: WEBSOCKET_SEND,
          payload: {
            type: action.type,
            body: action.payload,
          },
        });
      } catch (err) {
        console.log(err);
      }
  }
}
