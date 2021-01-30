import { AxiosResponse } from "axios";
import Router from "next/dist/client/router";
import { call, put, takeLatest } from "redux-saga/effects";
import RoomClient from "../../client/room";
import { RoomActionTypes } from "../../store/room/reducers";
import {
  ADD_PLAYER_TO_ROOM,
  CREATE_ROOM,
  SET_ACTIVE_ROOM,
} from "../../store/room/types";

export function* roomWatcher() {
  yield takeLatest(CREATE_ROOM, roomFlow);
}

function* roomFlow(action: RoomActionTypes) {
  // If create room -> Do sychronous http call to server to create room
  // Then synchronous http call to server to add player to that room

  switch (action.type) {
    case CREATE_ROOM:
      try {
        const response: AxiosResponse = yield call(RoomClient.createRoom);
        yield put({ type: SET_ACTIVE_ROOM, payload: response.data.roomName });
        yield call(Router.push, "/room/" + response.data.roomName);
      } catch (err) {
        console.log(err);
      }
      break;
    case ADD_PLAYER_TO_ROOM:
      try {
        const response: AxiosResponse = yield call(
          RoomClient.addPlayerToRoom,
          action.payload.roomName,
          action.payload.playerName
        );
      } catch (err) {
        console.log(err);
      }
      break;
  }
}
