import React, { ChangeEvent } from "react";
import { addPlayer, fetchActivePlayer } from "../store/player/actions";
import { connect } from "react-redux";
import { AppState } from "..";

type Props = {
  btnText: string;
};

const dispatchProps = {
  addPlayer: addPlayer,
  fetchActivePlayer: fetchActivePlayer,
};

const AddPlayerInput: React.FC<Props & typeof dispatchProps> = ({
  addPlayer,
  fetchActivePlayer,
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
      <button
        onClick={() => {
          addPlayer(player.name);
          fetchActivePlayer(player.name);
        }}
      >
        {btnText}
      </button>
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({});

export default connect(mapStateToProps, dispatchProps)(AddPlayerInput);
