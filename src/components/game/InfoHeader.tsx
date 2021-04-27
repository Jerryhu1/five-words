import { connect } from "react-redux";
import { AppState } from "../..";
import { Team } from "../../store/player/types";
import {createSelector} from "reselect";

type Props = {
  currTeam?: Team;
  currExplainer?: string;
};

const playerSelector = (state: AppState) => state.room.players
const teamSelector = (state: AppState) => state.room.teams
const currTeamSelector = (state: AppState) => state.room.teamTurn

const currExplainerSelector = createSelector(
  playerSelector,
  teamSelector,
  currTeamSelector,
  (players, team, currTeam) => {
    const t = team.get(currTeam)
    return t ? players.get(t.currExplainer)?.name : ""
  }
)

const InfoHeader: React.FC<Props> = ({ currTeam, currExplainer }) => {
  return (
    <>
      <h1>{!currTeam ? null : currTeam.name} is up!</h1>
      <h3>{!currExplainer ? null : currExplainer} will explain</h3>
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  currTeam: state.room.teams.get(state.room.teamTurn),
  currExplainer: currExplainerSelector(state)
});

export default connect(mapStateToProps)(InfoHeader);
