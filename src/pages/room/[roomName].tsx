import React from "react";
import { useRouter } from "next/dist/client/router";
import Lobby from "../../components/lobby/Lobby";
import { getRoom } from "../../store/room/actions";
import { connect } from "react-redux";
import { wsConnect } from "../../store/websocket/actions";

const dispatchProps = {
  getRoom: getRoom,
  wsConnect: wsConnect,
};

const Room: React.FC<typeof dispatchProps> = ({ getRoom, wsConnect }) => {
  const router = useRouter();
  const { roomName } = router.query;
  // Redirect user to player register page first
  if (roomName) {
    if (typeof roomName === "string") {
      getRoom(roomName);
    }
  }
  return (
    <div>
      <h1>{roomName}</h1>
      <Lobby roomName={roomName as string} />
    </div>
  );
};

export default connect(null, dispatchProps)(Room);
