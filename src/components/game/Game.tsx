import React from "react";
import InfoHeader from "./InfoHeader";
import Timer from "./Timer";
import WordCard from "./WordCard";
import {AppState} from "../../index";
import {connect} from "react-redux";
import {startTimer} from "../../store/timer/actions";

type Props = {
  timerStarted?: boolean
}

const dispatchProps = {
  startTimer: startTimer
}

export const Game: React.FC<Props & typeof dispatchProps> = ({}) => {
  const [showRoundTimer, setShowRoundtimer] = React.useState(false)

  const onCountDownTimerFinish = () => {
    setShowRoundtimer(true)

  }

  return (
    <div>
      <h1>Game</h1>
      <InfoHeader/>
      {
        // TODO: End round after timer finishes
        !showRoundTimer ? <Timer onTimeUp={onCountDownTimerFinish}/> : <Timer/>
      }
      <WordCard/>
    </div>
  )
};

const mapStateToProps = (state: AppState, _: Props) => ({
  timerStarted: state.timer.started,
  roomName: state.room.name
})

export default connect(mapStateToProps, dispatchProps)(Game)