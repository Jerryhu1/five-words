import React from "react";

type Props = {
  onSubmit: (name: string) => void;
};

const PlayerForm: React.FC<Props> = ({ onSubmit }) => {
  const [player, setPlayer] = React.useState("");
  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      <h1 className="text-2xl">What's your name?</h1>
      <input
        name="name"
        onChange={e => setPlayer(e.target.value)}
        value={player}
        type="text"
        className="text-black p-2 rounded-2xl text-2xl"
      />
      <button className="btn-primary" onClick={() => onSubmit(player)}>Next</button>
    </div>
  );
};

export default PlayerForm;
