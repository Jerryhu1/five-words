import React from "react";
import {useSelector} from "react-redux";
import {AppState} from "../..";

type Props = {
  onTimeUp?: () => void;
  show: boolean;
  seconds: number;
};

const Timer = ({onTimeUp, show, seconds}: Props) => {
  React.useEffect(() => {
    if (seconds === 0) {
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, [onTimeUp, seconds]);

  return (
    <>
      {show && (
        <div>
          <h1 className="text-6xl font-bold">{seconds}</h1>
        </div>
      )} </>
  );
};

export default Timer;
