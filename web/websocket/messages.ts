import { RoomState, START_ROUND } from "../src/store/room/types";

export const CREATE_ROOM = "CREATE_ROOM";
export const ADD_PLAYER_TO_ROOM = "ADD_PLAYER_TO_ROOM";
export const SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM";
export const GET_ROOM = "GET_ROOM";
export const SET_ROOM = "SET_ROOM";
export const START_GAME = "START_GAME";

type AddPlayerToRoomPayload = {
  roomName: string;
  sessionID: string;
  playerName: string;
};

type SetRoomPayload = {
  newState: RoomState;
};

type StartGamePayload = {
  roomName: string;
};

type StartRoundBody = {
  roomName: string;
  roundTime: number;
  countdownTime: number;
};

const addPlayerToRoom = (payload: AddPlayerToRoomPayload): RoomMessage => ({
  type: ADD_PLAYER_TO_ROOM,
  payload: payload,
});

const setRoom = (payload: SetRoomPayload): RoomMessage => ({
  type: SET_ROOM,
  payload: payload,
});
const startGame = (payload: StartGamePayload): RoomMessage => ({
  type: START_GAME,
  payload: payload,
});

const startRound = (payload: StartRoundBody): RoomMessage => ({
  type: START_ROUND,
  payload: payload,
});

export interface RoomMessage {
  type: string;
  payload: any;
}

export { addPlayerToRoom, setRoom, startGame, startRound };
