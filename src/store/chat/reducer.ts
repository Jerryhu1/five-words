import {ChatState} from "./types";
import * as actions from "./actions"
import {ActionType, getType} from "typesafe-actions";
const chatState: ChatState = {enabled: false, messages: []}

export type ChatActionTypes = ActionType<typeof actions>;


export const chatReducer = (
  state = chatState,
  action: ChatActionTypes
): ChatState => {
  switch(action.type) {
    case getType(actions.addMessage):
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload
        ]
      }
    case getType(actions.setEnable):
      return {
        ...state,
        enabled: action.payload.enable
      }
    default:
      return state
  }
}