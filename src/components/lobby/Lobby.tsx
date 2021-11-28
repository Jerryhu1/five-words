import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../..";
import TeamDisplay from "./TeamDisplay";
import Game from "../game/Game";
import React from "react";
import {startGame, startRound} from "../../store/room/actions";

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
  const teams = useSelector((state: AppState) => state.room.teams)
  const [canStart, setCanStart] = React.useState(true)

  // Uncomment when only allow to start with 2 players per team
  // React.useEffect(() => {
  //   teams.forEach((v, k) => {
  //     if (v.players.length < 2) {
  //       setCanStart(false)
  //     }
  //   })
  // }, [teams])

  return (
    <div className="flex flex-col px-32 py-16 h-full">
      <div className="flex justify-center">
        <div className="flex flex-col justify-center">
          <h1 className="text-6xl font-bold text-center">Lobby</h1>
          <h1 className="text-center">{roomName}</h1>
        </div>
      </div>
      <div className="flex flex-row">
        <TeamDisplay/>
        {showGame && <Game/>}
      </div>
      <div className="flex justify-center">
        {!showGame && (
          <button
            className={`w-64 btn-primary`}
            onClick={() => onStartGame(roomName)}
            disabled={!canStart}
          >
            START GAME
          </button>
        )}
      </div>
    </div>
  );
};

export default Lobby;
