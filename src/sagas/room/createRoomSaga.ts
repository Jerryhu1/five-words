import { AxiosResponse } from "axios";
import Router from "next/dist/client/router";
import { call, put, takeLatest } from "redux-saga/effects";
import RoomClient from "../../client/room";
import { FETCH_ACTIVE_PLAYER } from "../../store/player/types";
import { RoomActionTypes } from "../../store/room/reducers";
import {
  ADD_PLAYER_TO_ROOM,
  CREATE_ROOM,
  SET_ACTIVE_ROOM,
} from "../../store/room/types";

export function* roomWatcher() {
  yield takeLatest(CREATE_ROOM, roomFlow);
  yield takeLatest(ADD_PLAYER_TO_ROOM, roomFlow);
}

function* roomFlow(action: RoomActionTypes) {
  // If create room -> Do sychronous http call to server to create room
  // Then synchronous http call to server to add player to that room

  switch (action.type) {
    case CREATE_ROOM:
      try {
        // Register room in server, and update active room to response
        const response: AxiosResponse = yield call(RoomClient.createRoom);
        yield put({ type: SET_ACTIVE_ROOM, payload: response.data.roomName });

        // Dispatch action to add the player to the room,
        // Should return the id of the player
        // TODO: Might want to do this here instead of in another action due to a possible error
        yield put({
          type: ADD_PLAYER_TO_ROOM,
          payload: {
            roomName: response.data.roomName,
            playerName: action.payload.playerName,
          },
        });

        // Dispatch action to set the active player
        // TODO: Pass ID from previous request
        yield put({
          type: FETCH_ACTIVE_PLAYER,
          payload: { name: action.payload.playerName },
        });

        // Route the user to the room
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
        console.log(response);
      } catch (err) {
        console.log(err);
      }
      break;
  }
}
