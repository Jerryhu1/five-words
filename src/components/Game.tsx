import AddPlayerInput from "./AddPlayerInput";
import Timer from "./Timer";
import WordCard from "./WordCard";

export const Game: React.FC<{}> = () => (
  <div>
    <h1>Game</h1>
    <Timer />
    <AddPlayerInput />
    <WordCard />
  </div>
);
