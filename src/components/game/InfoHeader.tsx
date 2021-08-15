import { connect, useSelector } from "react-redux";
import { AppState } from "../..";
import { createSelector } from "reselect";
import { Team } from "../../types/player";

type Props = {
  currTeam?: Team;
  currExplainer?: string;
};

const playerSelector = (state: AppState) => state.room.players;
const teamSelector = (state: AppState) => state.room.teams;
const currTeamSelector = (state: AppState) => state.room.teamTurn;

const currExplainerSelector = createSelector(
  playerSelector,
  teamSelector,
  currTeamSelector,
  (players, team, currTeam) => {
    const t = team.get(currTeam);
    return t ? players.get(t.currExplainer)?.name : "";
  }
);

const InfoHeader: React.FC<Props> = () => {
  const currTeam = useSelector((state: AppState) =>
    state.room.teams.get(state.room.teamTurn)
  );
  if (!currTeam) {
    console.error(`could not get current team`);
  }

  const currExplainer = useSelector((state: AppState) =>
    currExplainerSelector(state)
  );

  return (
    <div className="flex flex-col">
      <h1>{!currTeam ? null : currTeam.name} is up!</h1>
      <h3>{!currExplainer ? null : currExplainer} will explain</h3>
    </div>
  );
};

export default InfoHeader;
