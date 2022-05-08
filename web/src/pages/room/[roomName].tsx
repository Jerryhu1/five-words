import React, {useEffect} from "react";
import { useRouter } from "next/dist/client/router";
import SocketProvider from "./layout/SocketProvider";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;

  useEffect(() => {
    // use roomname to send joinroom message to server
  })

  return (
    <SocketProvider>
      <div className="h-screen">
       Game
      </div>
    </SocketProvider>
  );
};

export default Room;
