import useWs from "react-use-websocket";

const useWebSocket = (connect: boolean) => {
  const { lastMessage, readyState, sendMessage } = useWs(
    "ws://localhost:8080",
    { share: true },
    connect
  );

  const sendSocketMessage = (msg: any) => {
    sendMessage(JSON.stringify(msg));
  };
  return {
    lastMessage: lastMessage,
    readyState: readyState,
    sendMessage: sendSocketMessage,
  };
};

export default useWebSocket;
