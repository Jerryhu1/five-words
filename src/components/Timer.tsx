import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "..";
import { tickTimer } from "../store/timer/action";
import { toggleSelect } from "../store/card/action";
type Props = {
  onTimeUp?: () => {};
  currTime?: number;
  maxTime?: number;
  started?: boolean;
};

type Dispatchers = {
  tickTimer: () => {};
  toggleSelect: () => {};
};

const resetTimer = () => {};

const onTimeUp = (onTimeUp: () => {}) => {
  // Show card to all players, including opposite team
  // Allow selecting words to mark correct
  // Show submit button
};

const timeDisplay = (currTime: number) => <>{currTime}</>;

const Timer: React.FC<Props & Dispatchers> = ({
  currTime,
  tickTimer,
  maxTime,
  started,
  toggleSelect,
}) => {
  React.useEffect(() => {
    if (!started) {
      return;
    }

    if (currTime != null && currTime <= 0) {
      toggleSelect();
      return;
    }
    const timer = setTimeout(() => {
      tickTimer();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currTime, started]);

  return (
    <>
      <div>
        <span>{currTime}</span>
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  onTimeUp: ownProps.onTimeUp,
  currTime: state.timer.time,
  maxTime: state.timer.maxTime,
  started: state.timer.started,
});

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({
  tickTimer: () => dispatch(tickTimer()),
  toggleSelect: () => dispatch(toggleSelect()),
});

export default connect(mapStateToProps, mapStateToDispatchers)(Timer);
