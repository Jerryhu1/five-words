import React from "react";
import { connect as wsConnect } from "@giantmachines/redux-websocket";

import { addPlayerToRoom } from "../../store/room/actions";
import { setActivePlayer } from "../../store/websocket/actions";
import PlayerForm from "./playerForm";
import RoomForm from "./roomForm";
import RoomClient from "../../client/room";
import { router } from "next/client";
import { useAppSelector } from "../../store/hooks";

const dispatchProps = {
  setActivePlayer: setActivePlayer,
  addPlayerToRoom: addPlayerToRoom,
  wsConnect: wsConnect,
};

type Props = {
  playerName: string;
  sessionID: string;
};

const Create: React.FC<typeof dispatchProps & Props> = ({
  setActivePlayer,
  addPlayerToRoom,
  wsConnect,
}) => {
  const [showPlayerForm, setShowPlayerForm] = React.useState(true);
  const { activePlayer, sessionID } = useAppSelector(store => store.session);
  const onSubmitPlayerForm = (name: string) => {
    // TODO: Determine host dynamically, or place somewhere else
    wsConnect("ws://localhost:8080");
    setActivePlayer(name);
    setShowPlayerForm(false);
  };

  const onSubmitRoomForm = (scoreGoal: number, language: string) => {
    try {
      // Register room in server, and update active room to response
      RoomClient.createRoom(scoreGoal, language).then(
        res => {
          addPlayerToRoom(res.data.name, sessionID, activePlayer);
          router.push("/room/" + res.data.name);
        },
        err => {
          console.log(err);
        }
      );
    } catch (err) {}
  };

  return (
    <div>
      {showPlayerForm ? (
        <PlayerForm onSubmit={onSubmitPlayerForm} />
      ) : (
        <div>
          Player: {activePlayer}
          <RoomForm onSubmit={onSubmitRoomForm} />
        </div>
      )}
    </div>
  );
};

export default Create;
