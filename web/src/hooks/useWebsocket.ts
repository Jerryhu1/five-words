import useWs from "react-use-websocket";
import { RoomMessage } from "../../message/types";
import { useAppSelector } from "../store/hooks";

export const getWsServerHost = () => {
  const host = process.env.NEXT_PUBLIC_WEB_HOST || "127.0.0.1:3000"

  if (process.env.NODE_ENV === "production") {
    return `wss://${host}/socket`
  }

  return `ws://${host}/socket`
}


const useWebSocket = (connect: boolean) => {
  const { sessionID } = useAppSelector(state => state.session);

  const { lastMessage, readyState, sendMessage } = useWs(
    getWsServerHost(),
    { share: true },
    connect
  );

  const sendSocketMessage = (sessionID: string, msg: RoomMessage) => {
    let messsage = {
      sessionID: sessionID,
      body: msg.body,
      type: msg.type
    }

    sendMessage(JSON.stringify(messsage));
  };
  return {
    lastMessage: lastMessage,
    readyState: readyState,
    sendMessage: (body: RoomMessage) => sendSocketMessage(sessionID,  body),
  };
};

export default useWebSocket;
