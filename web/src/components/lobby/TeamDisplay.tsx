import { AppState } from "../..";
import TeamCard from "./TeamCard";
import { useAppSelector } from "../../store/hooks";
import { Player } from "../../types/player";

const TeamDisplay = () => {
  const players = useAppSelector((state: AppState) => state.room.players);
  const sessionID = useAppSelector(
    (state: AppState) => state.session.sessionID
  );
  const teams = useAppSelector((state: AppState) => state.room.teams);
  const roomName = useAppSelector((state: AppState) => state.room.name);

  return (
    <div className="flex w-full gap-8">
      <div className="flex flex-col bg-purple p-5 w-1/4">
        <h1 className="text-xl font-bold p-2 mb-2 text-center">Players</h1>
        <ul className="flex flex-col h-full gap-2">
          {players &&
            Object.values(players).map((v: Player) => (
              <>
                {!v.teamID && (
                  <li className="bg-blue p-4" key={v.id}>
                    <div
                      className={
                        "uppercase font-bold " +
                        (!v.isActive ? "text-gray-400" : "text-white")
                      }
                    >
                      {v.name}
                    </div>
                  </li>
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
            Object.values(teams).map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDisplay;
