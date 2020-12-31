import { put, takeLatest } from "redux-saga/effects";
import {} from "../../store/player/actions";
import { PlayerActionTypes } from "../../store/player/reducers";
import { ADD_TEAM_PLAYER, ADD_TEAM_PLAYER_OK } from "../../store/player/types";

export function* addTeamPlayerWatcher() {
  yield takeLatest(ADD_TEAM_PLAYER, addTeamPlayerFlow);
}

function* addTeamPlayerFlow(action: PlayerActionTypes) {
  if (action.type === ADD_TEAM_PLAYER) {
    //TODO: Add player to the team, if response = ok, add to state
    yield put({ type: ADD_TEAM_PLAYER_OK, payload: action.payload });
  }
}
