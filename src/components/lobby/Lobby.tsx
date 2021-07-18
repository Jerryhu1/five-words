import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../..";
import TeamDisplay from "./TeamDisplay";
import Game from "../game/Game";
import React from "react";
import { startGame, startRound } from "../../store/room/actions";
import { Player, Team } from "../../types/player";

type Props = {
  roomName?: string;
  showGame?: boolean;
};

const Lobby: React.FC<Props> = () => {
  const roomName = useSelector((state: AppState) => state.room.name);
  const showGame = useSelector((state: AppState) => state.room.started);
  const dispatch = useDispatch();
  const onStartGame = (roomName: string) => {
    dispatch(startGame(roomName));
    dispatch(startRound(roomName, 3, 30));
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

export default Lobby;
