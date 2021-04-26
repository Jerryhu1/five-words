import { connect } from "react-redux";
import { AppState } from "../..";
import { addTeamPlayer } from "../../store/player/actions";
import { Player, Team } from "../../store/player/types";

type Props = {
  teams?: Map<string, Team>;
  activePlayer?: Player;
  players?: Map<string, Player>;
  roomName: string;
};

const dispatchProps = {
  addTeamPlayer: addTeamPlayer,
};

const Lobby: React.FC<Props & typeof dispatchProps> = ({
  activePlayer,
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
          !players ? null : Array.from(players).map(([k, v]) => (
            <ul style={!v.isActive ? {color: 'grey'} : {color: 'blue'}}>{v.name}</ul>
          ))
        }
        </li>
      </div>
      <div>Team</div>
      {!teams || !activePlayer
        ? null
        : Object.values(teams).map((team: Team, _) => (
            <div key={team.name}>
              <h1>{team.name}</h1>
              <ul>
                {team.players.map((player) => (
                  <li style={player === activePlayer.id ? {fontWeight: "bold"} : {}}
                      key={player}>
                    {players ? players.get(player)?.name : ""}
                  </li>
                ))}
              </ul>
              {team.players.filter((el) => el === activePlayer.id).length > 0 ? null : (
                <button
                  key={team.id}
                  onClick={() =>
                    !activePlayer
                      ? null
                      : addTeamPlayer(
                          roomName,
                          activePlayer.id,
                          team.name,
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
  activePlayer: state.game.activePlayer,
  players: state.room.players,
  roomName: state.room.name,
});

export default connect(mapStateToProps, dispatchProps)(Lobby);
