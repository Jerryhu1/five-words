import { createAction } from "typesafe-actions";
import {
  DEFAULT_PREFIX,
  WEBSOCKET_MESSAGE,
} from "@giantmachines/redux-websocket";
export const SET_SESSION = "SET_SESSION";
export const SET_ACTIVE_PLAYER = "SET_ACTIVE_PLAYER";
export const WS_RECEIVE_MESSAGE = `${DEFAULT_PREFIX}::${WEBSOCKET_MESSAGE}`;

export const setSession = createAction(SET_SESSION, (action) => {
  return (sessionID: string) =>
    action({
      sessionID: sessionID
    })
})

export const setActivePlayer = createAction(SET_ACTIVE_PLAYER, (action) => {
  return (activePlayer: string) =>
    action({
      activePlayer: activePlayer
    })
})