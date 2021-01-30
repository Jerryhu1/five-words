import { ActionType, getType } from "typesafe-actions";
import * as actions from "./actions";
import { RoomState } from "./types";

export type RoomActionTypes = ActionType<typeof actions>;

const initialState: RoomState = {
  activeRoom: "",
};

export const roomReducer = (
  state = initialState,
  action: RoomActionTypes
): RoomState => {
  switch (action.type) {
    case getType(actions.setActiveRoom):
      console.log(action);
      return {
        ...state,
        activeRoom: action.payload,
      };
    default:
      return state;
  }
};
