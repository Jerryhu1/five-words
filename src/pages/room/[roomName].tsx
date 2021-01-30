import React from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;
  console.log(roomName);
  return (
    <div>
      <h1>Room</h1>
    </div>
  );
};

export default Room;
