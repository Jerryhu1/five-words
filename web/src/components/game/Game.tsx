import React from "react";
import InfoHeader from "./InfoHeader";
import Timer from "./Timer";
import WordCard from "./WordCard";
import {AppState} from "../../index";
import {useSelector} from "react-redux";
import ChatBox from "./ChatBox";
import TeamCard from "../lobby/TeamCard";
import WinnerDialog from "./WinnerDialog";

export const Game = () => {
  const [showCountdownTimer, setShowCountdownTimer] = React.useState(false);

  const onCountDownTimerFinish = () => {
    setShowCountdownTimer(true);
  };
  const teams = useSelector((state: AppState) => state.room.teams);
  const currTime = useSelector((state: AppState) => state.room.timer);
  const winnerTeam = useSelector((state: AppState) => state.room.winnerTeam);
  return (
    <>
      {winnerTeam && <WinnerDialog/>}
      <div className="flex flex-col w-full">
        <div className="flex flex-row place-content-center">
          <div className="flex flex-col text-center">
            <div>
              <InfoHeader/>
            </div>
            <div>
              {
                !showCountdownTimer ? (
                  <Timer seconds={currTime} show={true} onTimeUp={onCountDownTimerFinish}/>
                ) : (
                  <Timer seconds={currTime} show={currTime > 0}/>
                )
              }
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full gap-4">
          <div className="flex flex-col w-1/5 gap-4">
            {teams && Object.values(teams).map(team => <TeamCard team={team}/>)}
          </div>
          <div className="flex flex-col w-3/5 items-center place-content-center">
            <WordCard/>
          </div>
          <div className="flex w-2/5 pr-12">
            <ChatBox/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
