import {connect, useSelector} from "react-redux";
import {AppState} from "../..";
import {createSelector} from "reselect";
import {Team} from "../../types/player";
import {useAppSelector} from "../../store/hooks";

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
    const t = team[currTeam];
    return t ? players[t.currExplainer]?.name : "";
  }
);

const InfoHeader: React.FC<Props> = () => {
  const currTeam = useSelector((state: AppState) =>
    state.room.teams[state.room.teamTurn]
  );

  const timer = useAppSelector(state => state.room.timer)
  if (!currTeam) {
    console.error(`could not get current team`);
  }

  const currExplainer = useSelector((state: AppState) =>
    currExplainerSelector(state)
  );

  const renderTimer = () => {
    if (timer !== 0) {
      return(<h3 className="text-4xl font-bold">
        It's
        <span className="uppercase">
          {!currExplainer ? null : currExplainer}
        </span>
        's turn!
      </h3>)
    }

    return (
      <h3 className="text-4xl font-bold">Time's up!</h3>
    )
  }

  return (
    <div className="flex flex-col">
      <h1>Team {!currTeam ? null : currTeam.name}</h1>
      {renderTimer()}
    </div>
  );
};

export default InfoHeader;
