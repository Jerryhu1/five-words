import useWs from "react-use-websocket";
import {getWsServerHost} from "../server";

const useWebSocket = (connect: boolean) => {
  const { lastMessage, readyState, sendMessage } = useWs(
    getWsServerHost,
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
