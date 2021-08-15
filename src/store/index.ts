import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { MakeStore, Context, createWrapper } from "next-redux-wrapper";
import { rootSaga } from "../sagas/rootSaga";
import createSagaMiddleware, { Task } from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxWebsocket from "@giantmachines/redux-websocket";
import { roomReducer } from "./room/reducers";
import {sessionReducer} from "./websocket/reducers";
import {cardReducer} from "./card/reducer";
import {chatReducer} from "./chat/reducer";

export const rootReducer = combineReducers({
  room: roomReducer,
  session: sessionReducer,
  card: cardReducer,
  chat: chatReducer
});

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export type RootState = ReturnType<typeof rootReducer>;
const reduxWebsocketMiddleware = reduxWebsocket();

const composeEnhancers = composeWithDevTools({
  serialize: true,
});

const makeStore: MakeStore<RootState> = (context: Context) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer /* preloadedState, */,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, reduxWebsocketMiddleware)
    )
  );
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
