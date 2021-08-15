import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../..";
import TeamDisplay from "./TeamDisplay";
import Game from "../game/Game";
import React from "react";
import { startGame, startRound } from "../../store/room/actions";

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
    <div className="flex flex-col px-32 h-full">
      <h1>{roomName}</h1>
      {roomName && (
        <div className="flex flex-row">
          <TeamDisplay />
          {showGame && <Game />}
        </div>
      )}
      {!showGame && (
        <button
          className="border border-solid border-green-400 rounded p-3 bg-green-400 text-white"
          onClick={() => onStartGame(roomName)}
        >
          Start game
        </button>
      )}
    </div>
  );
};

export default Lobby;
