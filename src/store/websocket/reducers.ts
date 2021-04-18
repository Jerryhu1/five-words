import {ActionType, getType} from "typesafe-actions";
import * as actions from "../websocket/actions";

export type SessionActionTypes = ActionType<typeof actions>;
type SessionState = {
  sessionID: string
}

const initialState: SessionState = {
  sessionID: ""
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
    default:
      return state;
  }
};
