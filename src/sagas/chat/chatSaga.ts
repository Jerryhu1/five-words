import { put, takeLatest } from "redux-saga/effects";
import { SEND_MESSAGE } from "../../store/chat/types";
import { ChatActionTypes } from "../../store/chat/reducer";
import { WEBSOCKET_SEND } from "@giantmachines/redux-websocket/dist";
import { getType } from "typesafe-actions";
import * as actions from "../../store/chat/actions";

export function* chatWatcher() {
  yield takeLatest(SEND_MESSAGE, chatFlow);
}

function* chatFlow(action: ChatActionTypes) {
  switch (action.type) {
    case getType(actions.sendMessage):
      yield put({
        type: WEBSOCKET_SEND,
        payload: {
          type: SEND_MESSAGE,
          body: action.payload,
        },
      });
      break;
  }
}
