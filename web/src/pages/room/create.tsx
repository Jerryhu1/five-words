import React, {useContext} from "react";
import PlayerForm from "./layout/PlayerForm";
import RoomForm from "./layout/RoomForm";
import RoomClient from "../../client/room";
import {router} from "next/client";
import {useAppSelector} from "../../store/hooks";
import {setActivePlayer} from "../../store/websocket/actions";
import {MessageType, newJoinRoomMessage, SocketContext} from "./layout/SocketProvider";

const Create = () => {
  const [showPlayerForm, setShowPlayerForm] = React.useState(true);
  const {activePlayer, sessionID} = useAppSelector(store => store.session);
  const {sendMessage, sessionId } = useContext(SocketContext)
  const [playerName, setPlayerName] = React.useState("");
  const onSubmitPlayerForm = (name: string) => {
    setPlayerName(name);
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
    } catch (err) {
    }

    // Create room

    // Add player to room
    sendMessage(newJoinRoomMessage({
      playerName: name,
      sessionId: sessionId,
    }));
    setActivePlayer(name);
    setShowPlayerForm(false);
  };

  return (
    <div>
      {showPlayerForm ? (
        <PlayerForm onSubmit={onSubmitPlayerForm}/>
      ) : (
        <div>
          Player: {activePlayer}
          <RoomForm onSubmit={onSubmitRoomForm}/>
        </div>
      )}
    </div>
  );
};

export default Create;
