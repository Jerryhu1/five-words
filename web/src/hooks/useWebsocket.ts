import useWs from "react-use-websocket";

export const getWsServerHost = () => {
  const host = process.env.NEXT_PUBLIC_WEB_HOST || "127.0.0.1:3000"

  if (process.env.NODE_ENV === "production") {
    return `wss://${host}/socket`
  }

  return `ws://${host}/socket`
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
