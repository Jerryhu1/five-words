import { put, takeLatest } from "redux-saga/effects";
import {} from "../../store/player/actions";
import { PlayerActionTypes } from "../../store/player/reducers";
import {
  ADD_TEAM_PLAYER,
  ADD_TEAM_PLAYER_OK,
  REMOVE_TEAM_PLAYER,
} from "../../store/player/types";
import { WS_SEND_MESSAGE } from "../../store/websocket/actions";

export function* addTeamPlayerWatcher() {
  yield takeLatest(ADD_TEAM_PLAYER, addTeamPlayerFlow);
}

interface AddTeamPlayerMessage {
  type: string;
  roomName: string;
  playerName: string;
  oldTeam: string;
  newTeam: string;
}

function* addTeamPlayerFlow(action: PlayerActionTypes) {
  if (action.type === ADD_TEAM_PLAYER) {
    //TODO: Add player to the team, if response = ok, add to state
    // Get current team of the player, either store team in player or go through all teams to look for player
    // Remove player from list where id = action.payload.player.id, i.e. filter operation
    //
    yield put({
      type: WS_SEND_MESSAGE,
      payload: { type: "ADD_TEAM_PLAYER", body: action.payload },
    });
  }
}
