import {createAction} from "typesafe-actions";
import {START_TIMER, SET_TIMER} from "./types";

export const startTimer = createAction(START_TIMER, (action) => {
  return (roomName: string, maxTime: number) =>
    action({
      roomName: roomName,
      maxTime: maxTime
    })
})

export const setTimer = createAction(SET_TIMER, (action) => {
  return (newTime: number) => action({
    newTime: newTime
  })
});
