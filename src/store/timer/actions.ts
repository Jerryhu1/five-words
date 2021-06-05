import {createAction} from "typesafe-actions";
import {START_ROUND} from "./types";

export const startRound = createAction(START_ROUND, (action) => {
  return (roomName: string, countdownTime: number, roundTime: number) =>
    action({
      roomName: roomName,
      roundTime: roundTime,
      countdownTime: countdownTime
    })
})
