import React, { ChangeEvent } from "react";
import { addPlayer } from "../store/player/actions";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "..";
type Props = {};

type Dispatchers = {
  addPlayer: (name: string) => void;
};

const AddPlayerInput: React.FC<Props & Dispatchers> = ({ addPlayer }) => {
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
      <button onClick={() => addPlayer(player.name)}>Add Player</button>
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({});

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({
  addPlayer: (name: string) => {
    console.log("dispathc");
    dispatch(addPlayer(name));
  },
});

export default connect(mapStateToProps, mapStateToDispatchers)(AddPlayerInput);
