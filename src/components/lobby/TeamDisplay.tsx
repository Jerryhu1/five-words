import {connect} from "react-redux";
import {AppState} from "../..";
import {addTeamPlayer} from "../../store/player/actions";
import {Player, Team} from "../../store/player/types";

type Props = {
  teams?: Map<string, Team>;
  sessionID?: string;
  players?: Map<string, Player>;
  roomName?: string;
};

const dispatchProps = {
  addTeamPlayer: addTeamPlayer,
};

const TeamDisplay: React.FC<Props & typeof dispatchProps> =
  ({
    sessionID,
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
        <h2>Teams</h2>
        {!teams || !sessionID
          ? null
          : Array.from(teams).map(([key, team]) => (
            <div key={team.name}>
              <h3>{team.name}</h3>
              <ul>
                {team.players.map((player) => (
                  <li style={player === sessionID ? {fontWeight: "bold"} : {}}
                      key={player}>
                    {players ? players.get(player)?.name : ""}
                  </li>
                ))}
              </ul>
              {team.players.filter((el) => el === sessionID).length > 0 ? null : (
                <button
                  key={team.id}
                  onClick={() =>
                    !sessionID
                      ? null
                      : addTeamPlayer(
                      roomName ?? "",
                      sessionID,
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

const mapStateToProps = (state: AppState, _: Props) => ({
  teams: state.room.teams,
  sessionID: state.session.sessionID,
  players: state.room.players,
  roomName: state.room.name,
});

export default connect(mapStateToProps, dispatchProps)(TeamDisplay);
