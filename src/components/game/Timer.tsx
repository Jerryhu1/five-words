import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../..";

type Props = {
  onTimeUp?: () => void;
  currTime?: number;
  maxTime?: number;
  started?: boolean;
};

const Timer: React.FC<Props> = ({ onTimeUp }) => {
  const currTime = useSelector((state: AppState) => state.room.timer);
  React.useEffect(() => {
    if (currTime === 0) {
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, [onTimeUp, currTime]);
  return (
    <div>
      <h1 className=" text-4xl">{currTime}</h1>
    </div>
  );
};

export default Timer;
