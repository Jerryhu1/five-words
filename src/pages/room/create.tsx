import React from "react";
import {connect} from "react-redux";
import {connect as wsConnect} from "@giantmachines/redux-websocket";

import {addPlayerToRoom, createRoom} from "../../store/room/actions";
import {AppState} from "../..";
import {setActivePlayer} from "../../store/player/actions";
import PlayerForm from "./playerForm";
import RoomForm from "./roomForm";
import RoomClient from "../../client/room";
import {router} from "next/client";

const dispatchProps = {
  setActivePlayer: setActivePlayer,
  addPlayerToRoom: addPlayerToRoom,
  wsConnect: wsConnect,
};

type Props = {
  playerName: string
  sessionID: string
};

const Create: React.FC<typeof dispatchProps & Props> = ({
  setActivePlayer,
  addPlayerToRoom,
  playerName,
  sessionID,
  wsConnect
}) => {

  const [showPlayerForm, setShowPlayerForm] = React.useState(true);

  const onSubmitPlayerForm = (name: string) => {
    wsConnect("ws://localhost:8080");
    setActivePlayer("", name, "")
    setShowPlayerForm(false)
  }

  const onSubmitRoomForm = (scoreGoal: number, language: string) => {
    try {
      // Register room in server, and update active room to response
      RoomClient.createRoom(scoreGoal, language).then(res => {
        addPlayerToRoom(res.data.name, sessionID, playerName)
        router.push("/room/" + res.data.name)
      }, err => {console.log(err)})
    } catch (err) {

    }
  }

  return (
    <div>
      {
        showPlayerForm ? <PlayerForm onSubmit={onSubmitPlayerForm} /> : (
          <div>
            Player: {playerName}
            <RoomForm onSubmit={onSubmitRoomForm} />
          </div>
          )
      }

    </div>
  );
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  playerName: state.game.activePlayer.name,
  sessionID: state.session.sessionID
});

export default connect(mapStateToProps, dispatchProps)(Create);
