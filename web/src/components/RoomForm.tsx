import React from "react";

type Props = {
  onSubmit: (scoreGoal: number, language: string) => void;
};

const RoomForm = ({ onSubmit }: Props) => {
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

export default RoomForm;
