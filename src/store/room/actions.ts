import {createAction} from "typesafe-actions";
import {
  ADD_PLAYER_TO_ROOM,
  CREATE_ROOM,
  GET_ROOM,
  RoomState,
  SET_ACTIVE_ROOM, SET_ROOM,
} from "./types";

export const createRoom = createAction(CREATE_ROOM, (action) => {
  return (
    scoreGoal: number,
    language: string
  ) =>
    action({
      scoreGoal: scoreGoal,
      language: language,
    });
});

export const setActiveRoom = createAction(SET_ACTIVE_ROOM, (action) => {
  return (roomState: RoomState) => action(roomState);
});

export const addPlayerToRoom = createAction(ADD_PLAYER_TO_ROOM, (action) => {
  return (roomName: string, sessionID: string, playerName: string) =>
    action({
      roomName: roomName,
      sessionID: sessionID,
      playerName: playerName,
    });
});

export const getRoom = createAction(GET_ROOM, (action) => {
  return (roomName: string) =>
    action({
      roomName: roomName,
    });
});

export const setRoom = createAction(SET_ROOM, (action) => {
  return (newState: RoomState) =>
    action({
      newState: newState
    });
});
