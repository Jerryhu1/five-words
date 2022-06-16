import {RoomState} from "../src/store/room";

export enum SendMessageType {
  CREATE_ROOM = "CREATE_ROOM",
  ADD_PLAYER_TO_ROOM = "ADD_PLAYER_TO_ROOM",
  SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM",
  GET_ROOM = "GET_ROOM",
  SET_ROOM = "SET_ROOM",
  START_GAME = "START_GAME",
  ADD_TEAM_PLAYER = "ADD_TEAM_PLAYER",
  START_ROUND = "START_ROUND",
  JOIN_ROOM = "JOIN_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  RESTART_GAME = "RESTART_GAME",
  TO_LOBBY = "TO_LOBBY",
}

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

type AddTeamPlayerBody = {
  roomName: string;
  playerID: string;
  team: string;
};

type JoinRoomBody = {
  roomName: string;
  playerName: string;
  sessionID: string;
};

type ChatMessageBody = {
  roomName: string;
  playerID: string;
  playerName: string;
  text: string;
};

type RestartGameBody = {
  roomName: string;
}

type ToLobbyBody = {
  roomName: string;
}

const restartGame = (payload: RestartGameBody): RoomMessage => ({
  type: SendMessageType.RESTART_GAME,
  body: payload
})

const toLobby = (payload: ToLobbyBody): RoomMessage => ({
  type: SendMessageType.TO_LOBBY,
  body: payload
})

const addPlayerToRoom = (payload: AddPlayerToRoomPayload): RoomMessage => ({
  type: SendMessageType.ADD_PLAYER_TO_ROOM,
  body: payload,
});

const setRoom = (payload: SetRoomPayload): RoomMessage => ({
  type: SendMessageType.SET_ROOM,
  body: payload,
});
const startGame = (payload: StartGamePayload): RoomMessage => ({
  type: SendMessageType.START_GAME,
  body: payload,
});

const startRound = (payload: StartRoundBody): RoomMessage => ({
  type: SendMessageType.START_ROUND,
  body: payload,
});

const addTeamPlayer = (payload: AddTeamPlayerBody): RoomMessage => ({
  type: SendMessageType.ADD_TEAM_PLAYER,
  body: payload,
});

const joinRoom = (payload: JoinRoomBody): RoomMessage => ({
  type: SendMessageType.JOIN_ROOM,
  body: payload,
});

const chatMessage = (payload: ChatMessageBody): RoomMessage => ({
  type: SendMessageType.SEND_MESSAGE,
  body: payload,
});

export interface RoomMessage {
  type: string;
  body: any;
}

export {
  restartGame,
  toLobby,
  addTeamPlayer,
  addPlayerToRoom,
  setRoom,
  startGame,
  startRound,
  chatMessage,
  joinRoom,
};
