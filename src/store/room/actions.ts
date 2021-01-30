import { createAction } from "typesafe-actions";
import { ADD_PLAYER_TO_ROOM, CREATE_ROOM, SET_ACTIVE_ROOM } from "./types";

export const createRoom = createAction(CREATE_ROOM, (action) => {
  return (playerName: string) => action({ playerName: playerName });
});

export const setActiveRoom = createAction(SET_ACTIVE_ROOM, (action) => {
  return (roomName: string) => action({ roomName: roomName });
});

export const addPlayerToRoom = createAction(ADD_PLAYER_TO_ROOM, (action) => {
  return (roomName: string, playerName: string) =>
    action({
      roomName: roomName,
      playerName: playerName,
    });
});
