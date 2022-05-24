import {useDispatch} from "react-redux";
import {AppState} from "../..";
import TeamDisplay from "./TeamDisplay";
import Game from "../game/Game";
import React from "react";
import {useAppSelector} from "../../store/hooks";
import {startGame, startRound} from "../../../websocket/messages";
import useWebSocket from "../../../hooks/useWebsocket";

type Props = {
  roomName?: string;
  showGame?: boolean;
};

const Lobby: React.FC<Props> = () => {
  const roomName = useAppSelector((state: AppState) => state.room.name);
  const showGame = useAppSelector((state: AppState) => state.room.started);
  const {sendMessage} = useWebSocket(true);

  const onStartGame = (roomName: string) => {
    sendMessage(startGame({roomName: roomName}));
    sendMessage(startRound({countdownTime: 5, roomName: roomName, roundTime: 30}));
  };
  const [canStart, setCanStart] = React.useState(true);

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
