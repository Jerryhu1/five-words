import { connect } from "react-redux";
import { AppState } from "..";
import { addTeamPlayer } from "../store/player/actions";
import { Player, Team } from "../store/player/types";

type Props = {
  teams?: Team[];
  player?: Player;
};

const dispatchProps = {
  addTeamPlayer: addTeamPlayer,
};

const Lobby: React.FC<Props & typeof dispatchProps> = ({
  player,
  teams,
  addTeamPlayer,
}) => {
  console.log(!teams);

  const addPlayerToTeam = (
    player: Player,
    playerID: string,
    teamIndex: number
  ) => {
    addTeamPlayer(player, playerID, teamIndex);
  };

  return (
    <>
      <div>Team</div>
      {!teams
        ? null
        : teams.map((value, index) => (
            <div>
              <h1>{value.name}</h1>
              <ul>
                {value.players.map((player, i) => (
                  <li>{player.name}</li>
                ))}
              </ul>
              {value.players.length > 0 ||
              value.players.filter((el) => el.id == player?.id).length >
                0 ? null : (
                <button
                  key={index}
                  onClick={() =>
                    !player ? null : addTeamPlayer(player, value.id, index)
                  }
                >
                  Join {value.name}
                </button>
              )}
            </div>
          ))}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  teams: state.game.teams,
  player: state.game.activePlayer,
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
