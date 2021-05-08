import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "../..";
import { setTimer } from "../../store/timer/actions";
import { toggleSelect } from "../../store/card/action";
type Props = {
  onTimeUp?: () => void;
  currTime?: number;
  maxTime?: number;
  started?: boolean;
};

type Dispatchers = {
  toggleSelect: () => {};
};

const Timer: React.FC<Props & Dispatchers> = ({
  currTime,
  onTimeUp,
}) => {
  React.useEffect(() => {
    if(currTime === 0) {
      if (onTimeUp) {
        onTimeUp()
      }
    }
  }, [onTimeUp, currTime])
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
  currTime: state.room.timer,
});

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({
  toggleSelect: () => dispatch(toggleSelect()),
});

export default connect(mapStateToProps, mapStateToDispatchers)(Timer);
