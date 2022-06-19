import React from "react";

type Props = {
  onSubmit: (scoreGoal: number, language: string, teams: number) => void;
};

const RoomForm = ({onSubmit}: Props) => {
  const [scoreGoal, setScoreGoal] = React.useState(15);
  const [teams, setTeams] = React.useState(2);
  // const [language, setLanguage] = React.useState("");
  const canSubmit = scoreGoal > 0
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl">Room settings</h1>
      <div className="flex items-center justify-center content-center gap-2">
        <h1 className="text-xl">Score goal</h1>
        <input
          className="text-black p-2 rounded-xl w-10 text-center"
          name="scoreGoal"
          value={scoreGoal}
          onChange={e => setScoreGoal(+e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center content-center gap-2">
        <h1 className="text-xl">Number of teams</h1>
        <input
          className="text-black p-2 rounded-xl w-10 text-center"
          type="number"
          name="teams"
          value={teams}
          onChange={e => {
            if (+e.target.value >= 2 && +e.target.value <= 4) {
              setTeams(+e.target.value)
            }
          }}
        />
      </div>

      {/*Language:*/}
      {/*<input*/}
      {/*  name="name"*/}
      {/*  onChange={e => setLanguage(e.target.value)}*/}
      {/*  value={language}*/}
      {/*  type="text"*/}
      {/*  placeholder="nl"*/}
      {/*/>*/}
      <button
        className="btn-primary"
        disabled={!canSubmit}
        onClick={() => {
          onSubmit(scoreGoal, "", teams);
        }}
      >
        Create
      </button>
    </div>
  );
};

export default RoomForm;
