import {Player, Team} from "../../types/player";
import {AppState} from "../../index";
import {useAppSelector} from "../../store/hooks";
import useWebSocket from "../../../hooks/useWebsocket";
import {addTeamPlayer} from "../../../websocket/messages";

type Props = {
  team: Team;
  players: Map<string, Player>;
};

const TeamCard: React.FC<Props> = ({team, players}) => {
  const inGame = useAppSelector((state: AppState) => state.room.started);
  const roomName = useAppSelector(state => state.room.name)
  const {activePlayer, sessionID} = useAppSelector(state => state.session)
  const {sendMessage} = useWebSocket(true);

  const onJoinTeam = (teamName: string) => {
    if (!sessionID) {
      console.error("tried to join team without session")
      return;
    }

    sendMessage(addTeamPlayer({playerID: activePlayer, roomName: roomName, team: teamName}))
  };

  return (
    <div
      key={team.name}
      className={`flex flex-col rounded p-4 w-2/3 bg-${team.name.toLowerCase()}-team shadows`}
    >
      <h3 className="text-xl font-bold text-center">{team.name}</h3>
      <ul>
        {team.players.map(player => (
          <li
            className="uppercase p-2"
            style={player === sessionID ? {fontWeight: "bold"} : {}}
            key={player}
          >
            {players && players.get(player)?.name}
          </li>
        ))}
      </ul>
      {inGame && <div>Score: {team.score}</div>}
      {!inGame && team.players.findIndex(el => el === sessionID) === -1 && (
        <div className="flex flex-end h-full">
          <button
            key={team.id}
            onClick={() => onJoinTeam(team.name)}
            className="rounded font-bold tracking-wider p-2.5 bg-white text-black ml-auto mt-auto"
          >
            JOIN
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
