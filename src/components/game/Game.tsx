import React from "react";
import InfoHeader from "./InfoHeader";
import Timer from "./Timer";
import WordCard from "./WordCard";
import { AppState } from "../../index";
import { connect } from "react-redux";
import ChatBox from "./ChatBox";

type Props = {};

const dispatchProps = {};

export const Game: React.FC<Props & typeof dispatchProps> = () => {
  const [showRoundTimer, setShowRoundtimer] = React.useState(false);

  const onCountDownTimerFinish = () => {
    setShowRoundtimer(true);
  };

  return (
    <div className="flex flex-row w-2/3 gap-4">
      <div className="flex flex-col w-1/2 items-center">
        {
          // TODO: End round after timer finishes
          !showRoundTimer ? (
            <Timer onTimeUp={onCountDownTimerFinish} />
          ) : (
            <Timer />
          )
        }
        <WordCard />
      </div>
      <div className="flex flex-col gap-12 w-1/2">
        <InfoHeader />
        <ChatBox />
      </div>
    </div>
  );
};

export default Game;
