import { createAction } from "typesafe-actions";
import room from "../../client/room";
import {
  ADD_PLAYER_TO_ROOM,
  CREATE_ROOM,
  RoomState,
  SET_ACTIVE_ROOM,
} from "./types";

export const createRoom = createAction(CREATE_ROOM, (action) => {
  return (
    roomName: string,
    playerName: string,
    scoreGoal: number,
    language: string
  ) =>
    action({
      roomName: roomName,
      playerName: playerName,
      scoreGoal: scoreGoal,
      language: language,
    });
});

export const setActiveRoom = createAction(SET_ACTIVE_ROOM, (action) => {
  return (roomState: RoomState) => action(roomState);
});

export const addPlayerToRoom = createAction(ADD_PLAYER_TO_ROOM, (action) => {
  return (roomName: string, playerName: string) =>
    action({
      roomName: roomName,
      playerName: playerName,
    });
});
