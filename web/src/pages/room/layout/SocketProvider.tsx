import React, {useEffect} from "react";
import {ReadyState} from "react-use-websocket";
import {
  AddPlayerToRoomMessage,
  AddTeamPlayerMessage,
  GameMessage, MessageType,
  SetRoomMessage, SocketMessage,
  StartGameMessage, StartRoundMessage
} from "../../../../message/types";
import useWebSocket from "../../../../hooks/useWebsocket";
import {setSession} from "../../../store/websocket/reducers";
import {useAppDispatch} from "../../../store/hooks";
import {setRoom} from "../../../store/room";

const SocketProvider: React.FC = ({children}) => {
  // TODO: dynamically determine url based on environment
  const {lastMessage, readyState} = useWebSocket(true);
  const [sessionId, setSessionId] = React.useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage) {
      handleSocketMessage(lastMessage as MessageEvent);
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleSocketMessage = (message: MessageEvent): void => {
    const msg = JSON.parse(message.data) as SocketMessage;
    if (msg.type === MessageType.ClientRegistered) {
      dispatch(setSession({sessionID: msg.body}));
      return;
    }

    const body = JSON.parse(msg.body);

    switch (msg.type) {
      case MessageType.SetRoom: {
        const b = body as SetRoomMessage
        dispatch(setRoom(b.body))
        break
      }
      case MessageType.AddTeamPlayer:
        const b = body as AddTeamPlayerMessage;
        break
      case MessageType.AddPlayerToRoom:
        body as AddPlayerToRoomMessage;
        break
      case MessageType.StartGame:
        body as StartGameMessage;
        break
      case MessageType.StartRound:
        body as StartRoundMessage;
        break
      default:
        console.error("Unknown message type: " + msg.type);
        break
    }
  }

  return (
    <>
      {children}
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      SessionId: {sessionId}
    </>
  );
};

export default SocketProvider;
