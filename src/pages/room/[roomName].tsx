import React from "react";
import { useRouter } from "next/dist/client/router";
import Lobby from "../../components/lobby/Lobby";
import { addPlayerToRoom, getRoom } from "../../store/room/actions";
import { useSelector } from "react-redux";
import { connect as wsConnect } from "@giantmachines/redux-websocket";
import { AppState } from "../../index";
import PlayerForm from "./playerForm";
import { setActivePlayer } from "../../store/websocket/actions";
import Game from "../../components/game/Game";
import SocketProvider from "./socketProvider";
import { useAppSelector } from "../../store/hooks";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;
  React.useEffect(() => {
    if (roomName) {
      if (typeof roomName === "string") {
        getRoom(roomName);
      }
    }
  }, [roomName, getRoom]);

  const [showPlayerForm, setShowPlayerForm] = React.useState(false);
  const showGame = useSelector((state: AppState) => state.room.started);
  const { activePlayer, sessionID } = useAppSelector(state => state.session);

  React.useEffect(() => {
    // Redirect user to player register page first
    if (activePlayer === "") {
      setShowPlayerForm(true);
    }
    if (sessionID === "") {
      // TODO: Determine host dynamically, or place somewhere else
      wsConnect("ws://localhost:8080");
    }
  }, [getRoom, wsConnect, activePlayer, sessionID]);

  const onPlayerFormSubmit = (name: string) => {
    setActivePlayer(name);
    addPlayerToRoom(roomName as string, sessionID, name);
    setShowPlayerForm(false);
  };

  return (
    <SocketProvider>
      <div className="h-screen">
        {showPlayerForm ? (
          <PlayerForm onSubmit={onPlayerFormSubmit} />
        ) : (
          <>{showGame ? <Game /> : <Lobby />}</>
        )}
      </div>
    </SocketProvider>
  );
};

export default Room;
