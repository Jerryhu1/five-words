import { createAction } from "typesafe-actions";
import {
  DEFAULT_PREFIX,
  WEBSOCKET_MESSAGE,
} from "@giantmachines/redux-websocket";
export const WS_SEND_MESSAGE = "WS_NEW_MESSAGE";
export const SET_SESSION = "SET_SESSION";
export const WS_RECEIVE_MESSAGE = `${DEFAULT_PREFIX}::${WEBSOCKET_MESSAGE}`;

export const setSession = createAction(SET_SESSION, (action) => {
  return (sessionID: string) =>
    action({
      sessionID: sessionID
    })
})