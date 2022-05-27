import React from "react";
import InfoHeader from "./InfoHeader";
import Timer from "./Timer";
import WordCard from "./WordCard";
import {AppState} from "../../index";
import {connect, useSelector} from "react-redux";
import ChatBox from "./ChatBox";
import TeamDisplay from "../lobby/TeamDisplay";
import TeamCard from "../lobby/TeamCard";

export const Game = () => {
  const [showRoundTimer, setShowRoundtimer] = React.useState(false);

  const onCountDownTimerFinish = () => {
    setShowRoundtimer(true);
  };
  const teams = useSelector((state: AppState) => state.room.teams);
  const players = useSelector((state: AppState) => state.room.players);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row place-content-center">
        <div className="flex flex-col text-center">
          <div>
            <InfoHeader/>
          </div>
          <div>
            {
              // TODO: End round after timer finishes
              showRoundTimer && <Timer onTimeUp={onCountDownTimerFinish}/>

            }
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col w-1/5 gap-4">
          {teams &&
          Object.values(teams).map((team => (
            <TeamCard team={team}/>
          )))}
        </div>
        <div className="flex flex-col w-3/5 items-center place-content-center">
          <WordCard/>
        </div>
        <div className="flex w-2/5 pr-12">
          <ChatBox/>
        </div>
      </div>
    </div>
  );
};

export default Game;