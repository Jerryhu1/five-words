import React from "react";
import PlayerForm from "../../components/PlayerForm";
import RoomForm from "../../components/RoomForm";
import RoomClient from "../../client/room";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setRoom} from "../../store/room";
import useWebSocket from "../../hooks/useWebsocket";
import {setActivePlayer} from "../../store/websocket/reducers";
import {joinRoom} from "../../../message/types";
import {useRouter} from "next/router";

const Create = () => {
  const [showPlayerForm, setShowPlayerForm] = React.useState(true);
  const {activePlayer, sessionID} = useAppSelector(store => store.session);
  const [playerName, setPlayerName] = React.useState("");
  const {sendMessage} = useWebSocket(true);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const onSubmitPlayerForm = (name: string) => {
    setPlayerName(name);
    dispatch(setActivePlayer({name: name}));
    setShowPlayerForm(false);
  };

  const onSubmitRoomForm = async (scoreGoal: number, language: string, teams: number) => {
    // Register room in server, and update active room to response
    const res = await RoomClient.createRoom(sessionID, scoreGoal, language, teams);
    dispatch(setRoom(res.data));
    sendMessage(
      joinRoom({
        playerName: playerName,
        roomName: res.data.name,
        sessionID: sessionID,
      })
    );
    setShowPlayerForm(false);
    router.push("/room/" + res.data.name);
  };

  return (
    <div className="flex p-20 justify-center">
      {showPlayerForm ? (
        <PlayerForm onSubmit={onSubmitPlayerForm}/>
      ) : (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl mb-10">Your name: {activePlayer}</h1>
          <RoomForm onSubmit={onSubmitRoomForm}/>
        </div>
      )}
    </div>
  );
};

export default Create;
