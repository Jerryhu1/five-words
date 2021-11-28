import React, { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SocketProvider: React.FC = ({ children }) => {
  const { lastMessage, readyState } = useWebSocket("ws://localhost:8090");

  useEffect(() => {
    console.log(lastMessage);
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      {children}
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
    </div>
  );
};

export default SocketProvider;
