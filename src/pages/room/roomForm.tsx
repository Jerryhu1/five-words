import React from "react";
import { AppState } from "../../index";
import { connect } from "react-redux";

type Props = {
  onSubmit: (scoreGoal: number, language: string) => void;
};

const RoomForm: React.FC<Props> = ({ onSubmit }) => {
  const [room, setRoom] = React.useState("");
  const [player, setPlayer] = React.useState("");
  const [scoreGoal, setScoreGoal] = React.useState(0);
  const [language, setLanguage] = React.useState("");

  return (
    <div>
      Score goal:
      <input
        type="number"
        name="scoreGoal"
        value={scoreGoal}
        onChange={e => setScoreGoal(+e.target.value)}
      />
      Language:
      <input
        name="name"
        onChange={e => setLanguage(e.target.value)}
        value={language}
        type="text"
        placeholder="nl"
      />
      <button
        onClick={() => {
          onSubmit(scoreGoal, language);
        }}
      >
        Create
      </button>
    </div>
  );
};

const mapStateToProps = (_: AppState, ownProps: Props) => ({
  onSubmit: ownProps.onSubmit,
});

export default connect(mapStateToProps)(RoomForm);
