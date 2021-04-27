import { connect } from "react-redux";
import { AppState } from "../..";
import { addTeamPlayer } from "../../store/player/actions";
import { Player, Team } from "../../store/player/types";
import TeamDisplay from "./TeamDisplay";
import {Game} from "../game/Game";
import React from "react";
import {startGame} from "../../store/room/actions";

type Props = {
  teams?: Map<string, Team>;
  activePlayer?: Player;
  players?: Map<string, Player>;
  roomName?: string;
};

const dispatchProps = {
  startGame: startGame,
};

const Lobby: React.FC<Props & typeof dispatchProps> = ({
  startGame,
  roomName
}) => {
  const [showGame, setShowGame] = React.useState(false)

  const onStartGame = (roomName: string) => {
    startGame(roomName)
    setShowGame(true)
  }
  return (
    <>
      {roomName &&
      <div>
          <button onClick={() => onStartGame(roomName)}>Start game</button>
          <TeamDisplay/>
        {showGame && <Game/>}
      </div>
      }
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  teams: state.room.teams,
  activePlayer: state.game.activePlayer,
  players: state.room.players,
  roomName: state.room.name
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
