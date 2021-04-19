import { connect } from "react-redux";
import { AppState } from "../..";
import { addTeamPlayer } from "../../store/player/actions";
import { Player, Team } from "../../store/player/types";

type Props = {
  teams?: Map<string, Team>;
  player?: Player;
  players?: Player[];
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
  players
}) => {
  return (
    <>
      <div>
        <li>
        Players:
        {
          players?.map(p => (
            <ul>{p.name}</ul>
          ))
        }
        </li>
      </div>
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
  players: Array.from(Object.values(state.room.players)),
  roomName: state.room.name,
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
