import {ActionType, getType} from "typesafe-actions";
import * as actions from "../websocket/actions";

export type SessionActionTypes = ActionType<typeof actions>;
type SessionState = {
  sessionID: string
  activePlayer: string
}

const initialState: SessionState = {
  sessionID: "",
  activePlayer: ""
};

export const sessionReducer = (
  state = initialState,
  action: SessionActionTypes
): SessionState => {
  switch (action.type) {
    case getType(actions.setSession):
      return {
        ...state,
        sessionID: action.payload.sessionID
      };
    case getType(actions.setActivePlayer):
      return {
        ...state,
        activePlayer: action.payload.activePlayer
      };
    default:
      return state;
  }
};
