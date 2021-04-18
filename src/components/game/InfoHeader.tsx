import { connect } from "react-redux";
import { AppState } from "../..";
import { Team } from "../../store/player/types";

type Props = {
  currTeam?: Team;
};

const InfoHeader: React.FC<Props> = ({ currTeam }) => {
  return <h1>{!currTeam ? null : currTeam.name} is up!</h1>;
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  currTeam: state.game.teams[state.game.turn],
});

export default connect(mapStateToProps)(InfoHeader);
