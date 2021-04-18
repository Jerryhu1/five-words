import { AxiosResponse } from "axios";
import Router from "next/dist/client/router";
import { call, put, takeLatest } from "redux-saga/effects";
import RoomClient from "../../client/room";
import {ADD_TEAM_PLAYER, FETCH_ACTIVE_PLAYER, SET_ACTIVE_PLAYER} from "../../store/player/types";
import { RoomActionTypes } from "../../store/room/reducers";
import {
  ADD_PLAYER_TO_ROOM,
  CREATE_ROOM,
  GET_ROOM,
  SET_ACTIVE_ROOM,
} from "../../store/room/types";
import { WS_SEND_MESSAGE } from "../../store/websocket/actions";
import {WEBSOCKET_SEND} from "@giantmachines/redux-websocket/dist";

export function* roomWatcher() {
  yield takeLatest(
    [CREATE_ROOM, ADD_PLAYER_TO_ROOM, GET_ROOM, FETCH_ACTIVE_PLAYER],
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

      console.log(response);
      yield put({ type: SET_ACTIVE_ROOM, payload: response.data });

      break;
    case CREATE_ROOM:
      // try {
      //   // Register room in server, and update active room to response
      //   const response: AxiosResponse = yield call(
      //     RoomClient.createRoom,
      //     action.payload.scoreGoal,
      //     action.payload.language
      //   );
      //   console.log(response);
      //   yield put({ type: SET_ACTIVE_ROOM, payload: response.data });
      //
      //   // Dispatch action to add the player to the room,
      //   // Should return the id of the player
      //   // TODO: Might want to do this here instead of in another action due to a possible error
      //   yield put({
      //     type: ADD_PLAYER_TO_ROOM,
      //     payload: {
      //       roomName: response.data.name,
      //       playerName: action.payload.playerName,
      //     },
      //   });
      //
      //   // Dispatch action to set the active player
      //   // TODO: Pass ID from previous request
      //   yield put({
      //     type: SET_ACTIVE_PLAYER,
      //     payload: { id: response.data.sessionID, name: action.payload.playerName, teamID: "" },
      //   });
      //
      //   // Route the user to the room
      //   yield call(Router.push, "/room/" + response.data.name);
      // } catch (err) {
      //   console.log(err);
      // }
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
  }
}
