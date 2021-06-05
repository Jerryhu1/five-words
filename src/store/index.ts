import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { MakeStore, Context, createWrapper } from "next-redux-wrapper";
import { rootSaga } from "../sagas/rootSaga";
import createSagaMiddleware, { Task } from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxWebsocket from "@giantmachines/redux-websocket";
import { roomReducer } from "./room/reducers";
import {sessionReducer} from "./websocket/reducers";
import {playerReducer} from "./player/reducers";
import {cardReducer} from "./card/reducer";

export const rootReducer = combineReducers({
  game: playerReducer,
  room: roomReducer,
  session: sessionReducer,
  card: cardReducer
});

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export type RootState = ReturnType<typeof rootReducer>;
const reduxWebsocketMiddleware = reduxWebsocket();

const makeStore: MakeStore<RootState> = (context: Context) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer /* preloadedState, */,
    composeWithDevTools(
      applyMiddleware(sagaMiddleware, reduxWebsocketMiddleware)
    )
  );
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
