import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas/rootSaga";
import reduxWebsocket from "@giantmachines/redux-websocket";
import { rootReducer, RootState } from "./store";

const sagaMiddleware = createSagaMiddleware();
const reduxWebsocketMiddleware = reduxWebsocket();

export type AppState = RootState;
const store = createStore(
  rootReducer /* preloadedState, */,
  composeWithDevTools(applyMiddleware(sagaMiddleware, reduxWebsocketMiddleware))
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
