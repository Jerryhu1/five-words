import React from "react";
import InfoHeader from "./InfoHeader";
import Timer from "./Timer";
import WordCard from "./WordCard";

export const Game: React.FC = () => (
  <div>
    <h1>Game</h1>
    <InfoHeader />
    <Timer />
    <WordCard />
  </div>
);
