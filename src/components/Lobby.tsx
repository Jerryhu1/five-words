import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "..";
import { addTeamPlayer } from "../store/player/actions";
import { Player, Team } from "../store/player/types";

type Props = {
  teams?: Team[];
  player?: Player;
};

type Dispatcher = {
  addTeamPlayer: (player: string, team: string) => {};
};

const Lobby: React.FC<Props & Dispatcher> = ({
  player,
  teams,
  addTeamPlayer,
}) => {
  return (
    <>
      <div>Team</div>
      {!teams
        ? null
        : teams.map((value, index) => {
            <div>
              <h1>{value.name}</h1>
              <ul>
                {value.players.map((player, i) => {
                  <li>{player.name}</li>;
                })}
              </ul>
              <button
                key={index}
                onClick={() =>
                  !player ? null : addTeamPlayer(player.id, value.id)
                }
              >
                Join {value.name}
              </button>
            </div>;
          })}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  teams: state.game.teams,
  player: state.game.activePlayer,
});

const mapStateToDispatchers = (dispatch: Dispatch) => ({
  addTeamPlayer: (playerID: string, teamID: string) =>
    dispatch(addTeamPlayer(playerID, teamID)),
});

export default connect(mapStateToProps, mapStateToDispatchers)(Lobby);
