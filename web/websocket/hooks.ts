import useWebSocket from "react-use-websocket";
import { RoomMessage } from "./messages";
import { useEffect } from "react";

const socketUrl = "ws://localhost:8080";

export const useSocket = (message: RoomMessage) => {
  const { sendJsonMessage } = useWebSocket(socketUrl);

  sendJsonMessage({
    type: message.type,
    body: message.payload,
  });
};

export const useReceiveSocket = () => {
  const { lastMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    console.log(lastMessage);
    switch (lastMessage.type) {
    }
  }, [lastMessage]);
};
