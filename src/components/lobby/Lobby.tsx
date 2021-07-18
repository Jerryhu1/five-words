import { connect } from "react-redux";
import { AppState } from "../..";
import TeamDisplay from "./TeamDisplay";
import Game from "../game/Game";
import React from "react";
import { startGame, startRound } from "../../store/room/actions";
import { Player, Team } from "../../types/player";

type Props = {
  teams?: Map<string, Team>;
  players?: Map<string, Player>;
  roomName?: string;
  showGame?: boolean;
};

const dispatchProps = {
  startGame: startGame,
  startRound: startRound,
};

const Lobby: React.FC<Props & typeof dispatchProps> = ({
  startGame,
  roomName,
  startRound,
  showGame,
}) => {
  const onStartGame = (roomName: string) => {
    startGame(roomName);
    startRound(roomName, 3, 30);
  };
  return (
    <>
      {roomName && (
        <div>
          {!showGame && (
            <button onClick={() => onStartGame(roomName)}>Start game</button>
          )}
          <TeamDisplay />
          {showGame && <Game />}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  teams: state.room.teams,
  players: state.room.players,
  roomName: state.room.name,
  showGame: state.room.started,
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
