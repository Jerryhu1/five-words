import { connect } from "react-redux";
import { AppState } from "..";
import { Team } from "../store/player/types";
import AddPlayerInput from "./AddPlayerInput";

type Props = {
  currTeam?: Team;
};

const PlayerSetup: React.FC<Props> = ({}) => {
  return (
    <>
      <h1>Welcome!</h1>
      <AddPlayerInput btnText="Next" />
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  currTeam: state.game.teams[state.game.turn],
});

export default connect(mapStateToProps)(PlayerSetup);
