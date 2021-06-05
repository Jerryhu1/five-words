import {put, takeLatest} from "redux-saga/effects";
import * as timerActionTypes from "../../store/timer/actions";
import {WEBSOCKET_SEND} from "@giantmachines/redux-websocket/dist";
import {ActionType} from "typesafe-actions";
import {START_ROUND} from "../../store/timer/types";

// When TIMER_START executes
// Run a saga that dispatches an increment action each second
// If the time = 0, then stop

export function* startTimerWatcher() {
  yield takeLatest(START_ROUND, startTimerFlow);
}

function* startTimerFlow(action: ActionType<typeof timerActionTypes>) {
  switch(action.type) {
    case START_ROUND:
      yield put({
        type: WEBSOCKET_SEND,
        payload: {
          type: START_ROUND,
          body: action.payload
        }
      })
  }
}
