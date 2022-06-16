import React from "react";

type Props = {
  onSubmit: (scoreGoal: number, language: string) => void;
};

const RoomForm = ({onSubmit}: Props) => {
  const [scoreGoal, setScoreGoal] = React.useState(0);
  // const [language, setLanguage] = React.useState("");

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
        onClick={() => {
          onSubmit(scoreGoal, "");
        }}
      >
        Create
      </button>
    </div>
  );
};

export default RoomForm;
