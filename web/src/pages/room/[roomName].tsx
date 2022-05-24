import React from "react";
import {useRouter} from "next/dist/client/router";
import Lobby from "../../components/lobby/Lobby";
import {AppState} from "../../index";
import RoomClient from "../../client/room";
import useWebSocket from "../../../hooks/useWebsocket";
import PlayerForm from "./layout/PlayerForm";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setRoom} from "../../store/room";
import {setActivePlayer} from "../../store/websocket/reducers";
import {addPlayerToRoom} from "../../../websocket/messages";


const Room = () => {
  const router = useRouter();
  const roomName = router.query.roomName as string;
  const {sendMessage} = useWebSocket(true);
  const {activePlayer, sessionID} = useAppSelector(state => state.session)
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    if (roomName) {
      RoomClient.getRoom(roomName).then(res => {
        dispatch(setRoom(res.data))
      })
    }
  }, [roomName, dispatch]);

  const [showPlayerForm, setShowPlayerForm] = React.useState(false);
  React.useEffect(() => {
    // Redirect user to player register page first
    if (activePlayer === "") {
      setShowPlayerForm(true);
    }

    if (sessionID !== "") {
      setLoading(false);
    }
  }, [activePlayer, sessionID]);

  const onPlayerFormSubmit = (name: string) => {
    console.log(name)
    dispatch(setActivePlayer({name: name}));
    sendMessage(addPlayerToRoom({playerName: name, roomName: roomName, sessionID: sessionID}));
    setShowPlayerForm(false);
  };

  const [loading, setLoading] = React.useState(true)

  const Component = () => {
    if (loading) {
      return <h1>Loading, please wait</h1>
    }
    if (showPlayerForm) {
      return <PlayerForm onSubmit={onPlayerFormSubmit}/>
    }

    return <Lobby/>

  }
  return (
    <div className="h-screen bg-gray-200">
      <Component/>
    </div>
  );
};

export default Room;