import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Game } from "./components/Game";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import { gameReducer } from "./store/player/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas/rootSaga";
import { cardReducer } from "./store/card/reducer";
import { timerReducer } from "./store/timer/reducer";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  game: gameReducer,
  card: cardReducer,
  timer: timerReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer /* preloadedState, */,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

sagaMiddleware.run(rootSaga);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
