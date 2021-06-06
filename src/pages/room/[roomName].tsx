import React from "react";
import {useRouter} from "next/dist/client/router";
import Lobby from "../../components/lobby/Lobby";
import {addPlayerToRoom, getRoom} from "../../store/room/actions";
import {connect} from "react-redux";
import {connect as wsConnect} from "@giantmachines/redux-websocket";
import {AppState} from "../../index";
import PlayerForm from "./playerForm";
import {setActivePlayer} from "../../store/websocket/actions";

type Props = {
  activePlayer: string
  sessionID: string
}

const dispatchProps = {
  getRoom: getRoom,
  wsConnect: wsConnect,
  setActivePlayer: setActivePlayer,
  addPlayerToRoom: addPlayerToRoom
};

const Room: React.FC<Props & typeof dispatchProps> = ({
  getRoom,
  wsConnect,
  activePlayer,
  sessionID,
  addPlayerToRoom,
  setActivePlayer
}) => {
  const router = useRouter();
  const {roomName} = router.query;
  React.useEffect(() => {
    if (roomName) {
      if (typeof roomName === "string") {
        getRoom(roomName);
      }
    }
  }, [roomName, getRoom])

  const [showPlayerForm, setShowPlayerForm] = React.useState(false)
  React.useEffect(() => {
    // Redirect user to player register page first
    if (activePlayer === "") {
      setShowPlayerForm(true)
    }
    if (sessionID === "") {
      // TODO: Determine host dynamically, or place somewhere else
      wsConnect("ws://localhost:8080");
    }
  }, [getRoom, wsConnect, activePlayer, sessionID])


  const onPlayerFormSubmit = (name: string) => {
    setActivePlayer(name)
    addPlayerToRoom(roomName as string, sessionID, name)
    setShowPlayerForm(false)
  }

  return (
    <div>
      {
        showPlayerForm ? <PlayerForm onSubmit={onPlayerFormSubmit}/> : (
          <div>
            <h1>{roomName}</h1>
            <Lobby />
          </div>
        )
      }
    </div>
  );
};

const mapStateToProps = (state: AppState, _: Props) => ({
  activePlayer: state.session.activePlayer,
  sessionID: state.session.sessionID
})


export default connect(mapStateToProps, dispatchProps)(Room);
