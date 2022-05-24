import {RoomState} from "../src/store/room";

export enum MessageType {
  SetRoom = "SET_ROOM",
  AddTeamPlayer = "ADD_TEAM_PLAYER",
  AddPlayerToRoom = "ADD_PLAYER_TO_ROOM",
  StartGame = "START_GAME",
  StartRound = "START_ROUND",
  SendMessage = "SEND_MESSAGE",
  ClientRegistered = "CLIENT_REGISTERED",
  JoinRoom = "JOIN_ROOM",
  Init = "INIT",
}

export interface SocketMessage {
  body: string;
  type: MessageType;
}

export interface AddTeamPlayerMessage {
  type: MessageType;
  playerId: string;
  team: string
}

export interface AddPlayerToRoomMessage {
  type: MessageType;
  payload: {
    playerId: string;
    sessionId: string;
  }
}

export interface StartGameMessage {
  type: MessageType;
}

export interface StartRoundMessage {
  type: MessageType;

}

export interface SetRoomMessage {
  type: MessageType;
  body: RoomState
}

export interface JoinRoomMessage {
  type: MessageType;
  body: {
    roomName: string;
    sessionId: string;
    playerName: string;
  }
}

const joinRoomMessage = (sessionId: string, playerName: string) => {
  return {
    type: MessageType.JoinRoom,
    sessionId: sessionId,
    playerName: playerName
  }
}

export interface ClientRegisteredMessage {
  type: MessageType;
  sessionId: string;
}

export type GameMessage =
  AddTeamPlayerMessage
  | AddPlayerToRoomMessage
  | StartGameMessage
  | StartRoundMessage
  | ClientRegisteredMessage;