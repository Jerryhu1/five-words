import {addPlayer} from "../../store/player/actions";
import {wsConnect} from "../../store/websocket/actions";
import React from "react";
import {connect} from "react-redux";
import {AppState} from "../../index";

type Props = {
  onSubmit: (name: string) => void
}

const PlayerForm: React.FC<Props> = ({onSubmit}) => {
  const [player, setPlayer] = React.useState("");
  return (
    <div>
      Player:
      <input
        name="name"
        onChange={(e) => setPlayer(e.target.value)}
        value={player}
        type="text"
      />
      <button
        onClick={() => onSubmit(player)}>
        Create
      </button>
    </div>
  )
}

const mapStateToProps = (_: AppState, ownProps: Props) => ({
  onSubmit: ownProps.onSubmit
})

export default connect(mapStateToProps)(PlayerForm)