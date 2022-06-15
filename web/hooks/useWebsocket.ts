import useWs from "react-use-websocket";

export const getWsServerHost = () => {
  const host = process.env.SERVER_HOST || "127.0.0.1:8080"
  if (process.env.NODE_ENV === "production") {
    return `wss://${host}`
  }

  return `ws://${host}`
}


const useWebSocket = (connect: boolean) => {
  const { lastMessage, readyState, sendMessage } = useWs(
    getWsServerHost(),
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
