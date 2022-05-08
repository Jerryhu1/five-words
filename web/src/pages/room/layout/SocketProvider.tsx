import React, {useEffect} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {GameMachineContext} from "../../../machines/gameMachine";
import {ClientRequest} from "http";

export const SocketContext = React.createContext({
  sessionId: "",
  sendMessage: (msg: SendSocketMessage) => {
  }
})

interface SocketMessage {
  body: string;
  type: MessageType;
}

interface SendSocketMessage {
  body: GameMessage;
  type: MessageType;
}

export enum MessageType {
  SetRoom = "SET_ROOM",
  AddTeamPlayer = "ADD_TEAM_PLAYER",
  AddPlayerToRoom = "ADD_PLAYER_TO_ROOM",
  StartGame = "START_GAME",
  StartRound = "START_ROUND",
  SendMessage = "SEND_MESSAGE",
  ClientRegistered = "CLIENT_REGISTERED",
  JoinRoom = "JOIN_ROOM",
}


export const newJoinRoomMessage = (msg: JoinRoomMessage): SendSocketMessage => {
  return {
    type: MessageType.JoinRoom,
    body: msg,
  }
}

export interface AddTeamPlayerMessage {
  playerId: string;
  team: string
}

export interface AddPlayerToRoomMessage {
  playerId: string;
  sessionId: string;
}

export interface StartGameMessage {
}

export interface StartRoundMessage {

}

export interface SetRoomMessage {

}

export interface JoinRoomMessage {
  sessionId: string;
  playerName: string;
}

export interface ClientRegisteredMessage {
  sessionId: string;
}

type GameMessage =
  AddTeamPlayerMessage
  | AddPlayerToRoomMessage
  | StartGameMessage
  | StartRoundMessage
  | ClientRegisteredMessage;

const mapSocketMsgToInternal = (message: MessageEvent): GameMessage => {
  const msg = JSON.parse(message.data) as SocketMessage;
  if (msg.type === MessageType.ClientRegistered) {
    return {sessionId: msg.body} as ClientRegisteredMessage
  }

  const body = JSON.parse(msg.body);
  switch (msg.type) {
    case MessageType.SetRoom:
      return body as GameMachineContext;
    case MessageType.AddTeamPlayer:
      return body as AddTeamPlayerMessage;
    case MessageType.AddPlayerToRoom:
      return body as AddPlayerToRoomMessage;
    case MessageType.StartGame:
      return body as StartGameMessage;
    case MessageType.StartRound:
      return body as StartRoundMessage;
    default:
      console.error("Unknown message type: " + msg.type);
      return {};
  }
}

const handleMessage = (msg: GameMessage) => {

}

const SocketProvider: React.FC = ({children}) => {
  // TODO: dynamically determine url based on environment
  const {lastMessage, readyState, sendMessage} = useWebSocket("ws://localhost:8080");
  const [sessionId, setSessionId] = React.useState("");

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage) {
      const msg = mapSocketMsgToInternal(lastMessage as MessageEvent);
      if (msg as ClientRegisteredMessage) {
        const cl = msg as ClientRegisteredMessage
        setSessionId(cl.sessionId);
      }

    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const sendSocketMessage = (msg: SendSocketMessage) => {
    sendMessage(JSON.stringify(msg));
  }

  return (
    <SocketContext.Provider value={{
      sessionId: "",
      sendMessage: sendSocketMessage,
    }}>
      {children}
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
