import React from "react";
import {useRouter} from "next/dist/client/router";
import Lobby from "../../components/lobby/Lobby";
import {addPlayerToRoom, getRoom} from "../../store/room/actions";
import {connect} from "react-redux";
import {connect as wsConnect} from "@giantmachines/redux-websocket";
import {Player} from "../../store/player/types";
import {AppState} from "../../index";
import PlayerForm from "./playerForm";
import {setActivePlayer} from "../../store/player/actions";

type Props = {
  activePlayer: Player
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
  // Redirect user to player register page first
  if (roomName) {
    if (typeof roomName === "string") {
      getRoom(roomName);
    }
  }


  const [showPlayerForm, setShowPlayerForm] = React.useState(false)
  React.useEffect(() => {
    if (activePlayer.name === "") {
      setShowPlayerForm(true)
    }
    if (sessionID === "") {
      wsConnect("ws://localhost:8080");
    }
  }, [activePlayer, sessionID])


  const onPlayerFormSubmit = (name: string) => {
    // TODO: Determine host dynamically, or place somewhere else
    setActivePlayer("", name, "")

    addPlayerToRoom(roomName as string, sessionID, name)
    setShowPlayerForm(false)
  }

  return (
    <div>
      {
        showPlayerForm ? <PlayerForm onSubmit={onPlayerFormSubmit}/> : (
          <div>
            <h1>{roomName}</h1>
            <Lobby roomName={roomName as string}/>
          </div>
        )
      }
    </div>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  activePlayer: state.game.activePlayer,
  sessionID: state.session.sessionID
})


export default connect(mapStateToProps, dispatchProps)(Room);
