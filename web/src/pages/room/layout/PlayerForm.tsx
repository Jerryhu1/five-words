import React from "react";

type Props = {
  onSubmit: (name: string) => void;
};

const PlayerForm: React.FC<Props> = ({onSubmit}) => {
  const [player, setPlayer] = React.useState("");
  return (
    <div>
      Player:
      <input
        name="name"
        onChange={e => setPlayer(e.target.value)}
        value={player}
        type="text"
        className="text-black"
      />
      <button onClick={() => onSubmit(player)}>Create</button>
    </div>
  );
};


export default PlayerForm;
