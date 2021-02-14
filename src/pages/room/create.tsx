import React from "react";
import { connect } from "react-redux";
import { addPlayer } from "../../store/player/actions";
import { wsConnect } from "../../store/websocket/actions";
import { createRoom } from "../../store/room/actions";
import { AppState } from "../..";

const dispatchProps = {
  addPlayer: addPlayer,
  createRoom: createRoom,
  wsConnect: wsConnect,
};

<<<<<<< HEAD
type Props = {
  activeRoom?: string;
};

const Create: React.FC<typeof dispatchProps & Props> = ({
  createRoom,
  wsConnect,
}) => {
  return (
    <div>
      <AddPlayerInput
        btnText="Create room"
        onAddPlayer={(name: string) => {
          wsConnect("ws://localhost:8080", name);
          createRoom(name);
        }}
=======
type Props = {};
const Create: React.FC<typeof dispatchProps & Props> = ({ createRoom }) => {
  const [room, setRoom] = React.useState("");
  const [player, setPlayer] = React.useState("");
  const [scoreGoal, setScoreGoal] = React.useState(0);
  const [language, setLanguage] = React.useState("");
  return (
    <div>
      Room name:
      <input
        type="text"
        name="roomName"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      Score goal:
      <input
        type="number"
        name="scoreGoal"
        value={scoreGoal}
        onChange={(e) => setScoreGoal(+e.target.value)}
>>>>>>> 3e418a8 (integrate room endpoints with FE)
      />
      Language:
      <input
        name="name"
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        type="text"
        placeholder="nl"
      />
      Player:
      <input
        name="name"
        onChange={(e) => setPlayer(e.target.value)}
        value={player}
        type="text"
      />
      <button
        onClick={() => {
          createRoom(room, player, scoreGoal, language);
        }}
      >
        Create
      </button>
    </div>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({});

export default connect(mapStateToProps, dispatchProps)(Create);
