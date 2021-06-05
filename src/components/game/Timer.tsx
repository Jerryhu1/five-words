import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "../..";
type Props = {
  onTimeUp?: () => void;
  currTime?: number;
  maxTime?: number;
  started?: boolean;
};

type Dispatchers = {
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

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({});

export default connect(mapStateToProps, mapStateToDispatchers)(Timer);
