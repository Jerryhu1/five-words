import React from "react";
import AddPlayerInput from "../lobby/AddPlayerInput";
import InfoHeader from "./InfoHeader";
import Lobby from "../lobby/Lobby";
import PlayerSetup from "../lobby/PlayerSetup";
import Timer from "./Timer";
import WordCard from "./WordCard";

export const Game: React.FC<{}> = () => (
  <div>
    <h1>Game</h1>
    <PlayerSetup />
    <Lobby />
    <InfoHeader />
    <Timer />
    <WordCard />
  </div>
);
