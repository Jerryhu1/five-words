import React, { useEffect } from "react";
import { ReadyState } from "react-use-websocket";
import useWebSocket from "../../hooks/useWebsocket";
import {useAppDispatch} from "../store/hooks";
import {ReceiveMessageType, SocketMessage} from "../store/websocket/types";
import {setSession} from "../store/websocket/reducers";
import {RoomState, setRoom} from "../store/room";
import {addMessage, Message} from "../store/chat";

const SocketProvider: React.FC = ({ children }) => {
  // TODO: dynamically determine url based on environment
  const { lastMessage, readyState } = useWebSocket(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (lastMessage) {
      handleSocketMessage(lastMessage as MessageEvent);
    }
  }, [lastMessage]);

  const handleSocketMessage = (message: MessageEvent): void => {
    const msg = JSON.parse(message.data) as SocketMessage;
    if (msg.type === ReceiveMessageType.ClientRegistered) {
      dispatch(setSession({ sessionID: msg.body }));
      return;
    }

    const body = msg.body;

    switch (msg.type) {
      case ReceiveMessageType.SetRoom: {
        const b = body as RoomState;
        dispatch(setRoom(b));
        break;
      }
      case ReceiveMessageType.AddMessage: {
        const b = body as Message;
        dispatch(addMessage(b));
        break;
      }
      default:
        console.error("Unknown message type: " + msg.type);
        break;
    }
  };

  return <>{children}</>;
};

export default SocketProvider;
