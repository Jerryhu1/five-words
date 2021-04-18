import { connect } from "react-redux";
import { AppState } from "../..";
import { addTeamPlayer } from "../../store/player/actions";
import { Player, Team } from "../../store/player/types";

type Props = {
  teams?: Map<string, Team>;
  player?: Player;
  roomName: string;
};

const dispatchProps = {
  addTeamPlayer: addTeamPlayer,
};

const Lobby: React.FC<Props & typeof dispatchProps> = ({
  player,
  teams,
  roomName,
  addTeamPlayer,
}) => {
  return (
    <>
      <div>Team</div>
      {!teams || !player
        ? null
        : Object.values(teams).map((team: Team, _) => (
            <div key={team.name}>
              <h1>{team.name}</h1>
              <ul>
                {Object.values(team.players).map((player) => (
                  <li key={player.name}>{player.name}</li>
                ))}
              </ul>
              {team.players.size > 0 ||
              Object.values(team.players).filter((el) => el.id == player.id)
                .length > 0 ? null : (
                <button
                  key={team.id}
                  onClick={() =>
                    !player
                      ? null
                      : addTeamPlayer(
                          roomName,
                          player.name,
                          team.name,
                          player.teamID
                        )
                  }
                >
                  Join {team.name}
                </button>
              )}
            </div>
          ))}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  teams: state.room.teams,
  player: state.game.activePlayer,
  roomName: state.room.name,
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
