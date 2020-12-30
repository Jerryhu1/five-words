import { put, takeLatest } from "redux-saga/effects";
import {
  FETCH_ACTIVE_PLAYER,
  GameActionTypes,
  Player,
  SET_ACTIVE_PLAYER,
} from "../../store/player/types";

export function* setActivePlayerWatcher() {
  yield takeLatest(FETCH_ACTIVE_PLAYER, setActivePlayerFlow);
}

function* setActivePlayerFlow(action: GameActionTypes) {
  //TODO: Register player by name to the server, set Name and ID of active player in state
  // Check if name not already exists in the game
  if (action.type === FETCH_ACTIVE_PLAYER) {
    const player: Player = { id: "0", name: action.payload };
    yield put({ type: SET_ACTIVE_PLAYER, payload: player });
  }
}
