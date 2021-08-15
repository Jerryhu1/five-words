import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "../..";
import { addTeamPlayer } from "../../store/player/actions";
import { Player, Team } from "../../types/player";

const TeamDisplay: React.FC<{}> = () => {
  const players = useSelector((state: AppState) => state.room.players);
  const sessionID = useSelector((state: AppState) => state.session.sessionID);
  const teams = useSelector((state: AppState) => state.room.teams);
  const roomName = useSelector((state: AppState) => state.room.name);

  return (
    <div className="flex flex-col w-1/3">
      <div>
        Players:
        {!players
          ? null
          : Array.from(players).map(([k, v]) => (
              <ul>
                {v.teamID === "" && (
                  <li
                    className={!v.isActive ? "text-gray-400" : "text-blue-400"}
                  >
                    {v.name}
                  </li>
                )}
              </ul>
            ))}
      </div>
      <h2>Teams</h2>
      <div className={`flex flex-col justify-around gap-2 p-2`}>
        {teams &&
          sessionID &&
          Array.from(teams).map(([key, team]) => (
            <TeamCard
              roomName={roomName}
              team={team}
              sessionID={sessionID}
              players={players}
            />
          ))}
      </div>
    </div>
  );
};

type TeamCardProps = {
  roomName: string;
  team: Team;
  sessionID: string;
  players: Map<string, Player>;
};

const TeamCard: React.FC<TeamCardProps> = ({
  roomName,
  team,
  sessionID,
  players,
}) => {
  const dispatch = useDispatch();
  const onJoinTeam = (teamName: string) => {
    if (!sessionID) {
      return;
    }
    dispatch(addTeamPlayer(roomName ?? "", sessionID, teamName));
  };

  return (
    <div
      key={team.name}
      className={`rounded p-3 w-2/3 bg-${team.name.toLowerCase()}-400 shadows`}
    >
      <h3>{team.name}</h3>
      <ul>
        {team.players.map((player) => (
          <li
            style={player === sessionID ? { fontWeight: "bold" } : {}}
            key={player}
          >
            {players && players.get(player)?.name}
          </li>
        ))}
      </ul>
      <div>Score: {team.score}</div>
      {team.players.findIndex((el) => el === sessionID) === -1 && (
        <button
          key={team.id}
          onClick={() => onJoinTeam(team.name)}
          className="rounded p-2 bg-green-400 text-white"
        >
          Join {team.name}
        </button>
      )}
    </div>
  );
};

export default TeamDisplay;
