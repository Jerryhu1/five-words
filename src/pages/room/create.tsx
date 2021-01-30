import React from "react";
import AddPlayerInput from "../../components/AddPlayerInput";
import { connect } from "react-redux";
import { addPlayer } from "../../store/player/actions";
import { wsConnect } from "../../store/websocket/actions";
import { createRoom } from "../../store/room/actions";
import { useRouter } from "next/dist/client/router";
import { AppState } from "../..";

const dispatchProps = {
  addPlayer: addPlayer,
  createRoom: createRoom,
  wsConnect: wsConnect,
};

type Props = {
  activeRoom?: string;
};

const Create: React.FC<typeof dispatchProps & Props> = ({ createRoom }) => {
  return (
    <div>
      <AddPlayerInput
        btnText="Create room"
        onAddPlayer={(name: string) => {
          createRoom(name);
        }}
      />
    </div>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  activeRoom: state.room.activeRoom,
});

export default connect(mapStateToProps, dispatchProps)(Create);
