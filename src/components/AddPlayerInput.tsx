import React, { ChangeEvent } from "react";
import { addPlayer, fetchActivePlayer } from "../store/player/actions";
import { connect } from "react-redux";
import { AppState } from "..";
import { wsConnect } from "../store/websocket/actions";

type Props = {
  btnText: string;
  onAddPlayer: (name: string) => void;
};

const dispatchProps = {
  addPlayer: addPlayer,
  wsConnect: wsConnect,
};

const AddPlayerInput: React.FC<Props & typeof dispatchProps> = ({
  onAddPlayer,
  btnText,
}) => {
  const [player, setPlayer] = React.useState({
    name: "",
  });

  const updatePlayer = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlayer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <input
        name="name"
        onChange={updatePlayer}
        value={player.name}
        type="text"
        placeholder="note"
      />
      <button onClick={() => onAddPlayer(player.name)}>{btnText}</button>
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({});

export default connect(mapStateToProps, dispatchProps)(AddPlayerInput);
