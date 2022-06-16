import {useSelector} from "react-redux";
import {AppState} from "../../index";
import React from "react";
import useWebSocket from "../../hooks/useWebsocket";
import {restartGame, toLobby} from "../../../message/types";
import {useAppSelector} from "../../store/hooks";

const WinnerDialog = () => {
  const winnerTeam = useAppSelector((state: AppState) => state.room.winnerTeam);
  const winningPlayers = useAppSelector((state: AppState) => state.room.teams)[winnerTeam]?.players
  const names = useAppSelector(state => state.room.players)
  const winners = React.useMemo(() => winningPlayers.map(p => names[p].name), [winningPlayers, names])

  const roomName = useAppSelector(state => state.room.name)
  const {sendMessage} = useWebSocket(true)

  const onToLobby = () => {
    sendMessage(toLobby({
      roomName: roomName
    }))
  }

  const onRestartGame = () => {
    sendMessage(restartGame({
      roomName: roomName
    }))
  }

  return (
    <>
      <div
        className={`flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 bg-purple drop-shadow-2xl rounded-md w-1/2 h-1/2 text-center`}>
        <h1 className="text-4xl mb-10">{winnerTeam} wins!</h1>
        <ul className="uppercase text-2xl">
          {
            Object.values(winners).map((p, i) => (
              <li key={i}>{p}</li>
            ))
          }
        </ul>

        <div className="flex justify-between px-2 mt-auto">
          <button onClick={onToLobby} className="border border-solid rounded-md p-3 bg-white text-black font-bold">
            To lobby
          </button>
          <button onClick={onRestartGame} className="border border-solid rounded-md p-3 bg-white text-black font-bold">
            Play again
          </button>
        </div>
      </div>
    </>
  )
}

export default WinnerDialog