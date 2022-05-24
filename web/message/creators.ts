import {JoinRoomMessage, MessageType} from "./types";

export const newJoinRoomMessage = (sessionId: string, playerName: string, roomName: string): JoinRoomMessage => {
  return {
    type: MessageType.JoinRoom,
    body:
      {
        roomName: roomName,
        playerName: playerName,
        sessionId: sessionId
      },
  }
}