import { useSelector } from "react-redux";
import { AppState } from "../..";
import TeamCard from "./TeamCard";

const TeamDisplay = () => {
  const players = useSelector((state: AppState) => state.room.players);
  const sessionID = useSelector((state: AppState) => state.session.sessionID);
  const teams = useSelector((state: AppState) => state.room.teams);
  const roomName = useSelector((state: AppState) => state.room.name);

  return (
    <div className="flex w-full gap-8">
      <div className="flex flex-col bg-purple p-5 w-1/4">
        <h1 className="text-xl font-bold p-2 mb-2 text-center">Players</h1>
        <ul className="flex flex-col h-full gap-2">
          {!players
            ? null
            : Array.from(players).map(([k, v]) => (
                <>
                  {!v.teamID && (
                    <div className="bg-blue p-4 ">
                      <li
                        className={
                          "uppercase font-bold " +
                          (!v.isActive ? "text-gray-400" : "text-white")
                        }
                      >
                        {v.name}
                      </li>
                    </div>
                  )}
                </>
              ))}
        </ul>
      </div>
      <div className="w-3/4">
        <h2>Teams</h2>
        <div className={`grid grid-cols-2 grid-rows-2`}>
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
    </div>
  );
};

export default TeamDisplay;
