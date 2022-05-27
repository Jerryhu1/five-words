import React from "react";
import PlayerForm from "./layout/PlayerForm";
import RoomForm from "./layout/RoomForm";
import RoomClient from "../../client/room";
import {router} from "next/client";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setRoom} from "../../store/room";
import useWebSocket from "../../../hooks/useWebsocket";
import {setActivePlayer} from "../../store/websocket/reducers";
import {joinRoom} from "../../../message/types";

const Create = () => {
  const [showPlayerForm, setShowPlayerForm] = React.useState(true);
  const {activePlayer, sessionID} = useAppSelector(store => store.session);
  const [playerName, setPlayerName] = React.useState("");
  const {sendMessage, lastMessage, readyState} = useWebSocket(true);

  const dispatch = useAppDispatch()
  const onSubmitPlayerForm = (name: string) => {
    setPlayerName(name);
    dispatch(setActivePlayer({name: name}));
    setShowPlayerForm(false)
  };

  const onSubmitRoomForm = async (scoreGoal: number, language: string) => {
    // Register room in server, and update active room to response
    const res = await RoomClient.createRoom(sessionID, scoreGoal, language);
    dispatch(setRoom(res.data))
    sendMessage(joinRoom({
      playerName: playerName, roomName: res.data.name, sessionID: sessionID
    }))
    setShowPlayerForm(false);
    router.push("/room/" + res.data.name);
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
