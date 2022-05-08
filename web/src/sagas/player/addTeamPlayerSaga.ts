import { put, takeLatest } from "redux-saga/effects";
import * as actions from "../../store/player/actions";
import { ADD_TEAM_PLAYER } from "../../store/player/types";
import { WEBSOCKET_SEND } from "@giantmachines/redux-websocket/dist";
import { ActionType } from "typesafe-actions";

type PlayerActionTypes = ActionType<typeof actions>;

export function* addTeamPlayerWatcher() {
  yield takeLatest(ADD_TEAM_PLAYER, addTeamPlayerFlow);
}

function* addTeamPlayerFlow(action: PlayerActionTypes) {
  if (action.type === ADD_TEAM_PLAYER) {
    yield put({
      type: WEBSOCKET_SEND,
      payload: {
        type: "ADD_TEAM_PLAYER",
        body: action.payload,
      },
    });
  }
}
