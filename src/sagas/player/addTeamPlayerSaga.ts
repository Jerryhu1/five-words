import { put, takeLatest } from "redux-saga/effects";
import { PlayerActionTypes } from "../../store/player/reducers";
import {
  ADD_TEAM_PLAYER,
} from "../../store/player/types";
import { WS_SEND_MESSAGE } from "../../store/websocket/actions";

export function* addTeamPlayerWatcher() {
  yield takeLatest(ADD_TEAM_PLAYER, addTeamPlayerFlow);
}

function* addTeamPlayerFlow(action: PlayerActionTypes) {
  if (action.type === ADD_TEAM_PLAYER) {
    yield put({
      type: WS_SEND_MESSAGE,
      payload: { type: "ADD_TEAM_PLAYER", body: action.payload },
    });
  }
}
