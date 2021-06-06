import {createAction} from "typesafe-actions";
import {ADD_MESSAGE, SET_ENABLE} from "./types";

export const addMessage = createAction(ADD_MESSAGE, (action) => {
  return (timestamp: Date, text: string, playerID: string, playerName: string) => action({
    timestamp: timestamp,
    text: text,
    playerID: playerID,
    playerName: playerName,
  })
})

export const setEnable = createAction(SET_ENABLE, (action) => {
  return (enable: boolean) => action({
    enable: enable
  })
})