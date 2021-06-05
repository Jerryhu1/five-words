import { connect } from "react-redux";
import { AppState } from "../..";
import { Player, Team } from "../../store/player/types";
import TeamDisplay from "./TeamDisplay";
import Game from "../game/Game";
import React from "react";
import {startGame} from "../../store/room/actions";
import {startRound} from "../../store/timer/actions";

type Props = {
  teams?: Map<string, Team>;
  activePlayer?: Player;
  players?: Map<string, Player>;
  roomName?: string;
  showGame?: boolean;
};

const dispatchProps = {
  startGame: startGame,
  startRound: startRound
};

const Lobby: React.FC<Props & typeof dispatchProps> = ({
  startGame,
  roomName,
  startRound,
  showGame
}) => {

  const onStartGame = (roomName: string) => {
    startGame(roomName)
    // TODO: Get this from room settings instead of hardcoded
    startRound(roomName, 3, 30)
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
  roomName: state.room.name,
  showGame: state.room.started
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
