import { ActionType, getType } from "typesafe-actions";
import * as actions from "./actions";
import { RoomState } from "./types";

export type RoomActionTypes = ActionType<typeof actions>;

const initialState: RoomState = {
  name: "",
  owner: "",
  players: [],
  teams: [],
  scoreGoal: 0,
  teamTurn: 0,
  currentCard: {
    id: "",
    words: [],
    correct: 0,
  },
  language: "",
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
<<<<<<< HEAD
        activeRoom: action.payload.roomName,
=======
        ...action.payload,
>>>>>>> 3e418a8 (integrate room endpoints with FE)
      };
    default:
      return state;
  }
};
